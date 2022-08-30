from database import *

class SearchCount(db.Model):
    tablename = 'searchcount'

    searchID = db.Column(db.Integer, primary_key=True)
    searchText = db.Column(db.String(200), nullable = False)
    count = db.Column(db.Integer, nullable=False)

    def init(self, searchText, count):
        self.searchText = searchText
        self.count = count

    def json(self):
        return {
            "searchID" : self.searchID,
            "searchText": self.searchText,
            "count" : self.count
        }


def search_text(qn): #crude search no algorithmic smoothening of suggestions yet (i.e., for each sentence in a word, suggest)
    try:
        looking_for = '%{0}%'.format(qn)

        suggestions = SearchCount.query.filter(SearchCount.searchText.ilike(looking_for)).all()
        
        print( suggestions)
        return 200, [suggestion.json() for suggestion in suggestions]
    except:
        print("none found")



