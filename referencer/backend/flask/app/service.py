from nltk import word_tokenize as wt, sent_tokenize as st
from collections import defaultdict
import re, chardet, docx

class normalizer:
    def new_gettext(file):
        try:
            print(f'{file}')
            if file.endswith('.txt'):
                text = open(rf'{file}','rb')
                text_body = text.read()
                enc = chardet.detect(text_body).get("encoding")
                print(enc)
                if enc and enc.lower() != "utf-8" and enc.lower() != "windows-1251":
                    text_body = text_body.decode(enc)
                    text_body = text_body.encode("utf-8")
                    text_body = text_body.decode("utf-8")
                    print('Открыт текст!')
                    return text_body
                elif enc and enc.lower() == "windows-1251":
                    text = open(rf'{file}', 'r', encoding = 'windows-1251')
                    text_body = text.read()
                    text.close()
                    print('Открыт текст!')
                    return text_body
                else:
                    text = open(rf'{file}', 'r', encoding = 'UTF-8')
                    text_body = text.read()
                    text.close()
                    print('Открыт текст!')
                    return text_body
            elif file.endswith('.docx'):
                doc = docx.Document(rf'{file}')
                text = (paragraph.text for paragraph in doc.paragraphs)
                text_body = '\n'.join(text)
                return text_body
            else:
                print('Неподдерживаемый формат!')
                pass
        except:
            pass 

    def insert_breaks(text):
        text = re.sub('([А-Я]).([А-Я]). ([А-Я])',r'\1.\2._\3', text) #Here we try to save names like В.И. Ленин by underscoring spaces in them
        text = re.sub('([А-Я]). ([А-Я]). ([А-Я])',r'\1._\2._\3', text) #Here we try to save names like Л. Д. Троцкий by underscoring spaces in them
        sents = st(text)
        with_breaks = ' BREAK '.join(sents)
        with_breaks = re.sub('_',' ', with_breaks) #Here we replace our underscores by regular spaces
        with_breaks = with_breaks + ' BREAK'
        #print('Разделители вставлены!')
        return with_breaks

    def linearize(result):
        if 'analysis' not in result:
            text = result['text']
            lex = 'NONE'
            gr = 'NONE'
        else:
            if len(result['analysis']) == 0:
                text = result['text']
                lex = 'NONE'
                gr = 'NONE'
            else:
                text = result['text']
                analysis = result['analysis'][0]
                lex = analysis['lex']
                gr = [item for item in re.split('[,=|()]',analysis['gr']) if item != '']
        if text == ' ' or text=='\n':
            pass
        else:
            return {'token': text, 'lemma':lex, 'grammar': gr}
        
    def separator(jsn):
        sents = defaultdict(list)
        count = 0
        token_count = 0
        sents[0] = []
        for item in jsn:
            if item['token'] != 'BREAK':
                item['number'] = token_count
                token_count += 1
                sents[count].append(item)
            else:
                count += 1
                sents[count] = []
                token_count = 0
        sents = {num: sents[num] for num in sents if sents[num] != []}
        return sents


            
