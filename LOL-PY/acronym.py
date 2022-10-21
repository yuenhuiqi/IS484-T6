def matchkeywords(str_test):
    acronym_list = str_test.replace('\n','').split(",")

    for acronym in acronym_list:
        acronym_meaning = acronym.split(' | ')
        print(acronym_meaning)
