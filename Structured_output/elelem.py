import chromadb, json, ollama, os, pandas as pd, pickle, time
from openai import OpenAI
from pydantic import BaseModel
from prompts import *
from typing import Literal

CURRENT_DIR = os.getcwd()
client = chromadb.PersistentClient(path=rf'{CURRENT_DIR}')
#print(client.list_collections())

class Classes:

    class Bool(BaseModel):
        class Step(BaseModel):
            explanation: str
            output: bool
        steps: list[Step]
        result: bool

    class Reasoning(BaseModel): 
        class Contraindication(BaseModel):
            contraindication: str
            phase: str
            dose: str
            form: str
            age: str
            duration: str
            simultaneous_drug: str
        class Step(BaseModel):
            class Contraindication(BaseModel):
                contraindication: str
                phase: str
                dose: str
                form: str
                age: str
                duration: str
                simultaneous_drug: str
            explanation: str
            output: list[Contraindication]
        steps: list[Step]
        answer: list[Contraindication]

    class TrueOrFalse(BaseModel):
        class Idea(BaseModel):
            explanation: str
            output: bool
        steps: list[Idea]
        result: bool
    
    class WhichType(BaseModel):
        class Step(BaseModel):
            explanation: str
            output: str
        result: Literal['Общие противопоказания','С осторожностью']

class Evaluate:

    def search_db(query):
        aperiendum = open('pairs','rb')
        pairs = pickle.load(aperiendum)
        open_icd = open('icds','rb')
        icd = pickle.load(open_icd)
        global client
        collection = client.get_collection(name=f'disease_descriptions')
        response = ollama.chat(
        messages=[
            {'role':'user',
                'content':f'Опиши это заболевание: {query}'},
                {'role':'system',
                'content':'Ты компетентный медицинский справочник. Ты даёшь краткое, но ёмкое описание НА РУССКОМ ЯЗЫКЕ длиной 5 предложений.'}
        ],
        model = 'qwen2.5:14b'
    )
        target_description = response['message']['content']
        problem = ollama.embeddings(
            prompt=target_description,
            model = "bge-m3"
            )
        emb = problem["embedding"]
        results = collection.query(
            query_embeddings=emb,
            n_results=10
        )
        results = results['documents'][0]
        names = [pairs[result] for result in results]
        res = []
        for name in names:
            for item in icd:
                if name == item['Name']:
                    res.append(item)
        print(res)
        return res
    
    def pregnancy_classifier(contraindication): #классификатор для перенесения показаний из "беременности и лактации" в 
        judgement = ollama.chat(
            messages=[
                {'role':'user',
                    'content':f'{contraindication}'},
                {'role':'user',
                 'content':Analytic.classifier}
            ],
            model = 'qwen2.5:14b',
            format = Classes.WhichType.model_json_schema()
        )
        print(judgement)
        content = judgement['message']['content']
        res = json.loads(content)['result']
        return res

    def boolean_classifier(comparatum,comparandum):
        print(f'{comparatum} vs. {comparandum}')
        judgement = ollama.chat(
            messages=[
                {'role':'user',
                    'content':f'{comparatum} VS {comparandum}'},
                    {'role':'system',
                    'content':Analytic.judge}
            ],
            model = 'qwen2.5:7b',
            format = Classes.Bool.model_json_schema(),
            options = {'temperature':0.1}
        )
        content = judgement['message']['content']
        print(content)
        res = json.loads(content)['result']
        print(res)
        return res

class Process:

    def key(text):
        question = text
        output = ollama.chat(
            messages=[{'role':'user',
                    'content':question},
                {'role':'system',
                'content':Analytic.system}
            ],
            model = 'qwen2.5:7b',
            format = Classes.Reasoning.model_json_schema(),
        )
        #print(output)
        content = output['message']['content']
        print(content)
        json_content = json.loads(content)
        res = json_content['answer']
        return res
    
    def item(item): #анализ каждого json-вхождения в базе данных
        global client
        print(f'Процессинг препарата {item}!')
        beginning = time.time()
        new_item = []
        mnn = item['MNN']
        mnn_rus = item['МНН']
        for x in ['Contra','Caution','Pregnant','Driver']:
            if x == 'Contra':
                rus = 'Общие противопоказания'
            elif x == 'Caution':
                rus = 'С осторожностью'
            elif x == 'Pregnant':
                rus = 'Беременность и лактация'
            elif x == 'Driver':
                rus = 'Вождение и управление механизмами'
            text = item[x]
            if text == 'nan' or item[x] == 'Не выявлено.':
                new_item.append({'MNN': f'{mnn}',
                                    'МНН':f'{mnn_rus}',
                                    'тип_противопоказания':rus,
                    'противопоказание': '_',
                                     'фаза': '_',
                                       'доза': '_',
                                         'форма': '_',
                                           'возраст': '_',
                                             'длительность_приёма': '_',
                                               'одновременный_препарат': '_',
                                               'исходный_текст':text})
            else:
                processed_keys = Process.key(text)
                for k in processed_keys:
                    new_item.append({'MNN': f'{mnn}',
                                    'МНН':f'{mnn_rus}',
                                    'тип_противопоказания':rus,
                    'противопоказание': k['contraindication'],
                                     'фаза': k['phase'],
                                       'доза': k['dose'],
                                         'форма': k['form'],
                                           'возраст': k['age'],
                                             'длительность_приёма': k['duration'],
                                               'одновременный_препарат': k['simultaneous_drug'],
                                               'исходный_текст':text})

        end = time.time()
        print(f'''Обработка препарата {item["МНН"]} завершена!
              Она заняла {end-beginning} сек.
''')
        return new_item
