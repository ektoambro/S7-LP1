python -m venv venv
CALL venv\Scripts\activate.bat
pip install flask pymysql flask_bcrypt flask_login cryptography
python app.py
pause