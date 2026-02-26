from auxiliaries import *
from elelem import *
from multiprocessing import Pool
import pickle

def multistart():
    if __name__ == '__main__':
        tosave = open('res_1','wb')
        DB.make_()
        db = DB.open_()[0:30]
        with Pool(6) as p:
            items = p.map(Process.item,db)
        items = [js for item in items for js in item]
        final_items = []
        for js in items:
            contratype = js['тип_противопоказания']
            if contratype == 'Беременность и лактация':
                new_contratype = Evaluate.pregnancy_classifier(js['противопоказание'])
                new_js = {'MNN': js["MNN"],
                                    'МНН':js["МНН"],
                                    'тип_противопоказания':f'{new_contratype}',
                    'противопоказание': js['противопоказание'],
                                     'фаза': js['фаза'],
                                       'доза': js['доза'],
                                         'форма': js['форма'],
                                           'возраст': js['возраст'],
                                             'длительность_приёма': js['длительность_приёма'],
                                               'одновременный_препарат': js['одновременный_препарат'],
                                               'исходный_текст':js['исходный_текст']}
                final_items.append(new_js)
            else:
                final_items.append(js)
        pickle.dump(final_items, tosave)

def multicontinuation(): #переделать, слишком сложно!
    file = open('res','rb')
    database = pickle.load(file)
    #ICD.contras_to_codes(database)
    ICD.evaluator()
    #res = ICD.unique_encoder(database)
    #ICD.to_xlsx(res)
    


multistart()
multicontinuation()
