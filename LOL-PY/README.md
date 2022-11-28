## 1. Setting up development server

Create environment

    python -m venv env

Activate environment 
- Windows:

        env\scripts\activate
- Mac/Linux:

        source env/bin/activate

Install requirements

    pip install -r requirements.txt

Install Spacy library
    
    python -m spacy download en_core_web_sm

Run `python setupDB.py` to reset the database

Run `python app.py` to start the development server for python backend. Navigate to http://localhost:2222/. The application will automatically reload if you change any of the source files.
