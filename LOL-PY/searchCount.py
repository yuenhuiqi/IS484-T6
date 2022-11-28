from database import *
from collections import Counter
import re
import math

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer


class SearchCount(db.Model):
    tablename = 'searchcount'

    searchID = db.Column(db.Integer, primary_key=True)
    searchText = db.Column(db.String(200), nullable=False)
    count = db.Column(db.Integer, nullable=False)  # no of user clicks
    merit = db.Column(db.Integer, nullable=False)  # feedback
    demerit = db.Column(db.Integer, nullable=False)

    def init(self, searchText, count):
        self.searchText = searchText
        self.count = count
        self.merit = 0
        self.demerit = 0

    def json(self):
        return {
            "searchID": self.searchID,
            "searchText": self.searchText,
            "count": self.count,
            "merit": self.merit,
            "demerit": self.demerit
        }


def initial_search():
    try:
        suggestions = SearchCount.query.order_by(
            SearchCount.count.desc()).limit(5).all()

        return 200, [suggestion.json() for suggestion in suggestions]
    except:
        return "none found"


def search_text(qn):  # crude search no algorithmic smoothening of suggestions yet (i.e., for each sentence in a word, suggest)
    print(qn)
    if '{0}'.format(qn) == "-":
        return initial_search()
    else:
        try:
            looking_for = '%{0}%'.format(qn)
            suggestions = SearchCount.query.filter(SearchCount.searchText.ilike(
                looking_for)).order_by(SearchCount.count.desc()).limit(10).all()

            return 200, [suggestion.json() for suggestion in suggestions]
        except:
            return "none found"


def add_count(qn):
    query = '{0}'.format(qn)
    query = query.lower().rstrip('_+!@#$?^/ ')

    if db.session.query(exists().where(SearchCount.searchText == query)).scalar():
        currentQuery = SearchCount.query.filter_by(searchText=query).first()
        currentQuery.count += 1
        try:
            db.session.commit()
            return 200, "Search count updated"
        except Exception as e:
            return 400, e
        
    else:
        newQuery = SearchCount(searchText=query, count=1, merit = 0, demerit = 0)
        try: 
            db.session.add(newQuery)
            db.session.commit()
            return 200, "Query added to DB!"

        except Exception as e:
            return 400, e


def getSuggestedSearches(query):
    try: 
        query_list = SearchCount.query.with_entities(SearchCount.searchText).all()
        sim_dict = {}
        for q in query_list:
            q_vector = text_to_vector(q[0])
            query_vector = text_to_vector(query)
            sim_dict[q[0]] = get_cosine(q_vector, query_vector)
            
        desc_sim_dict = sorted(sim_dict.items(), key=lambda x: x[1], reverse=True)
        
        # getting top 3 most relevant searches
        if len(desc_sim_dict) >= 3: 
            top_3_searches = [desc_sim_dict[0][0], desc_sim_dict[1][0], desc_sim_dict[2][0]]
        else:
            top_3_searches = []
            for i in range(len(desc_sim_dict)):
                top_3_searches.append(desc_sim_dict[i][0])
    
        return top_3_searches

    except:
        return 400, "no suggested searches, try making a search first? :)"

def text_to_vector(text):
    ps = PorterStemmer()
    stop_words = set(stopwords.words('english')) 
    query = word_tokenize(text)
    processedQuery = ''
    for w in query:
        if not w in stop_words:
            processedQuery += " " + ps.stem(w)
    
    WORD = re.compile(r"\w+")
    words = WORD.findall(processedQuery)
    return Counter(words)
    
def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x] ** 2 for x in list(vec1.keys())])
    sum2 = sum([vec2[x] ** 2 for x in list(vec2.keys())])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator

