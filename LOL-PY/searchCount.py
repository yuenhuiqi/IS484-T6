from database import *


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
        # print(suggestions)

        return 200, [suggestion.json() for suggestion in suggestions]
    except:
        print("none found")


def search_text(qn):  # crude search no algorithmic smoothening of suggestions yet (i.e., for each sentence in a word, suggest)
    print(qn)
    if '{0}'.format(qn) == "-":
        return initial_search()
    else:
        try:
            looking_for = '%{0}%'.format(qn)
            suggestions = SearchCount.query.filter(SearchCount.searchText.ilike(
                looking_for)).order_by(SearchCount.count.desc()).limit(10).all()
            # print(suggestions)

            return 200, [suggestion.json() for suggestion in suggestions]
        except:
            print("none found")


def add_count(qn):
    query = '{0}'.format(qn)
    query = query.lower()

    if db.session.query(exists().where(SearchCount.searchText == query)).scalar():
        print(query, "query exist")
        currentQuery = SearchCount.query.filter_by(searchText=query).first()
        currentQuery.count += 1
        try:
            db.session.commit()
            return 200, "Search count updated"
        except Exception as e:
            print("Something Happened (Update Search Query Count): ", e)
            return 400, e
        
    else:
        print(query, "new query")
        newQuery = SearchCount(searchText=query, count=1, merit = 0, demerit = 0)
        try: 
            db.session.add(newQuery)
            db.session.commit()
            return 200, "Query added to DB!"

        except Exception as e:
            print("Something Happened (Add new Search Query): ", e)
            return 400, e
        

def update_feedback(qn, feedback):
    print(feedback, qn)
    try:
        current_score = SearchCount.query.filter(SearchCount.searchText==qn).first()
        print(current_score)
        if feedback > 0:
            current_score.merit += feedback
        else:
            current_score.demerit += feedback
        db.session.commit()
        return 200, "updated"
    except:
        return 400, "couldn't update"




