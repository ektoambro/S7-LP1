python -m venv venv
CALL venv\Scripts\activate.bat
pip install flask pymysql
pip install flask_login
pip install flask_bcrypt
python app.py
pause