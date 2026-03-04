import sqlite3, re, docx, os
import tkinter as t
from tkinter import scrolledtext as scr
from tkinter.messagebox import showinfo as info
import tkinter.filedialog as fd
from nltk import word_tokenize as wt
from nltk import sent_tokenize as st
print('(C) Евгений Геннадьевич Соколов, Институт лингвистических исследований РАН, СПб., 2023.')

def referencer():
    database = sqlite3.connect('all_references.db')
    cur = database.cursor()
    #cur.execute('CREATE TABLE IF NOT EXISTS refs(headword TEXT, example TEXT, reference TEXT)')
    cur.execute('PRAGMA encoding="utf-8"')
    cur.execute('CREATE TABLE IF NOT EXISTS refers(headword TEXT, head TEXT, example TEXT, link TEXT, issue TEXT)')

    res = ''
    romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV']
    #Список римских цифр, которые исключаем из числа заголовков

    current_directory = os.getcwd()
    print(current_directory)
    files = fd.askopenfilenames()
    
    def processing(file):
        doc = docx.Document(rf'{file}')
        issue = st(file)[0]
        issue = issue.split(r'/')
        issue = re.sub('\.','', issue[-1])
        print(issue)
        result = []
        final_result = docx.Document()
        count = 0

        headword = '' #Выносим переменную "Заголовочное слово" за цикл, чтобы она менялась только при смене её в цикле на непустую новую

        for paragraph in doc.paragraphs:
            if '@' not in paragraph.text and paragraph.text != '':
                    raw_text = paragraph.text.strip(' ') #сперва убираем пробелы с концов
                    raw_text = re.sub('[<>]','', raw_text)
                    raw_text = re.sub('^[I,X,V]','',raw_text)
                    raw_text = re.sub('\. См\.','PUNCT FOREVERALONE', raw_text) #Тут заменяю См. на бред, чтобы токенизатор не разбивал на разные предложения
                    tokens = wt(raw_text)
                    candidates = [x for x in tokens[0:2] if (not(x.isdigit()) and (x[0] not in romans) and x.isupper())]
                    if candidates == []:
                        pass
                    else:
                        headword = candidates[0]
                        
                    if 'FOREVERALONE' in raw_text:
                        sents = st(raw_text)
                        #print(sents)
                        examples = [x.split('FOREVERALONE') for x in sents if 'FOREVERALONE' in x]
                        triplets = [{'headword':re.sub('PUNCT','.', headword),'example':re.sub('PUNCT','.', item[0]), 'ref_word':item[1].strip()} for item in examples]
                        quadrs = [{'headword':item['headword'], 'head':re.sub('[0-9]','', re.sub('\u0301','', item['headword'])),\
                                    'example':item['example'], 'ref':re.sub('\u0301','', item['ref_word'].upper()).strip('.,:;!?')} for item in triplets]
                        [cur.execute('INSERT INTO refers(headword,head,example,link,issue) VALUES(?,?,?,?,?)',[item['headword'],item['head'],item['example'],item['ref'],issue])\
                            for item in quadrs]
                        
    [processing(item) for item in files]

    database.commit()
    info('База данных заполнена','Можно начинать поиск ссылок')

def ref_search():
    database = sqlite3.connect('all_references.db')
    cur = database.cursor()
    cur.execute('PRAGMA encoding="utf-8"')

    def click():
        search_scroll.delete(1.0,t.END)
        query = search_txt.get(1.0, t.END).upper().strip()
        #print(query)
        result = cur.execute(f'''SELECT *
                            FROM refers
                            ''')
        necessary = [quadruple for quadruple in result if re.sub(' ','',quadruple[3])==query]
        res_json = [{'headword':quadruple[0],'example':quadruple[2], 'issue':quadruple[4]} for quadruple in necessary]
        #print(list(res_json))
        for_text = [f'{item["issue"]}, \n статья: {item["headword"]},\n пример:\n{item["example"]}\n{"* "*40}\n\n' for item in res_json]
        search_text = '\n'.join(for_text)
        search_scroll.insert(t.INSERT, search_text)

    search_window = t.Tk()
    search_window.title("Поиск ссылок на слово")
    search_window.geometry('800x600')
    search_label = t.Label(search_window,text='Введите искомую лексему:',font=('Arial',20))
    search_txt = t.Text(search_window,width=50,height=1,font=('Arial',15))
    search_letters = t.Frame(search_window)
    search_butt = t.Frame(search_window)
    search_yat = t.Button(search_letters,text='ѣ',command=lambda:search_txt.insert(t.INSERT, 'ѣ'),font=('Arial',15))
    search_fita = t.Button(search_letters,text='ѳ',command=lambda:search_txt.insert(t.INSERT, 'ѳ'),font=('Arial',15))
    search_izhitsa = t.Button(search_letters,text='ѵ',command=lambda:search_txt.insert(t.INSERT, 'ѵ'),font=('Arial',15))
    search_button = t.Button(search_butt,text='Найти ссылки',command=click,font=('Arial',15))
    search_scroll = scr.ScrolledText(search_window, width=50,height=100,font=('Arial',14))
    search_label.pack()
    search_txt.pack()
    search_yat.pack(side='left')
    search_fita.pack(side='left')
    search_izhitsa.pack(side='left')
    search_button.pack()
    search_letters.pack()
    search_butt.pack()
    search_scroll.pack()
    search_window.mainloop()

new_window = t.Tk()
new_window.title('База данных и поиск ссылок')
new_window.geometry('400x400')
null_label = t.Label(new_window)
new_label = t.Label(new_window,text='Выберите действие:',font=('Arial',20))
db_button = t.Button(new_window,text='Создать поисковую БД',command=referencer,font=('Arial',20))
ref_button = t.Button(new_window,text='Поиск ссылок',command=ref_search,font=('Arial',20))
quit_button = t.Button(new_window,text='Выход',command=lambda:new_window.destroy(),font=('Arial',20))
null_label.pack()
new_label.pack()
db_button.pack()
ref_button.pack()
quit_button.pack()
new_window.mainloop()