from flask import Flask, render_template, request, redirect, url_for, jsonify
import pymysql
import flask_login 
from flask_bcrypt import Bcrypt 

app = Flask(__name__) 

app.secret_key = 'k573U@ge#%RyQ@DoTe5' 
bcrypt = Bcrypt(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User(flask_login.UserMixin):
    id = None

    def get_id(self):
        return str(self.id) if self.id else None

@login_manager.user_loader
def user_loader(id):
    user = User()
    instance = conn.cursor()
    instance.execute('SELECT id FROM users WHERE id = %s', (id,))
    result = instance.fetchone()
    if result:
        user.id = result['id']
        return user
    return None  # User not found
@app.route("/api/register_user", methods=['POST'])
def UserRegister():
    data = request.form
    if not data:
        return jsonify({"status" : "error", "message": "invalid payload"})
    
    LastName = data.get('LastName')
    FirstName = data.get('FirstName')

    Mail = data.get('Mail')     # change and add more as needed. 
    Password = data.get('Password')
    PasswordHash = bcrypt.generate_password_hash(Password).decode('utf-8') 
    try:
        instance = conn.cursor()
        instance.execute('INSERT INTO users (last_name,first_name,email,password_hash) VALUES (%s, %s, %s, %s)', 
                        (LastName, FirstName, Mail, PasswordHash))
        conn.commit()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    return jsonify({"status": "success", "message": "Insert successful!"})

@app.route("/")
def home():
    return render_template("homepage.html")

@app.route("/about") 
def about(): 
    return render_template("about.html") 

@app.route("/login") 
def login(): 
    return render_template("login.html") 

@app.route("/register") 
def register(): 
    return render_template("register.html") 
    
 # Get email from URL parameters, default to "Player"
    email = request.args.get('email', 'Player')
    return render_template("confirmed-login.html", email=email)

@app.route("/wheelspin") 
def wheelspin(): 
    return render_template("wheelspin.html") 

@app.route("/roulette") 
def roulette(): 
    return render_template("roulette.html") 

@app.route("/slots") 
def slots(): 
    return render_template("slots.html") 

@app.route("/blackjack") 
def blackjack(): 
    return render_template("blackjack.html") 

@app.route('/submit', methods=["POST"]) 
def submit(): 
    # Get the email from the form
    email = request.form['email']
    # Just pass the email to the confirmation page
    return redirect(url_for('confirmed_login', email=email))

# creates the connection to the DB. If the DB is not running, this will crash your server! (add a # to commment it out in that case)
conn = pymysql.connect(
  host='localhost', 
  user='root', 
  password='root', 
  database='the_base', 
  cursorclass=pymysql.cursors.DictCursor
)

# starting with /api/ is not required, but it can be nice to separate human-readable pages from pages that are there to use the DB
@app.route("/api/get_all_users")
def getAllUsers():
    instance = conn.cursor()                    # starts an instance of the connection
    instance.execute('SELECT * FROM users')     # runs the "select all columns" query
    return jsonify(instance.fetchall())         # transforms the result in the JSON data format and returns all rows

@app.route("/api/insert_user", methods=['GET'])
def insertUserGET():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})
    if not 'email' in data: 
        return jsonify({"status": "error", "message": "Missing email"})  
    if not 'last_name' in data: 
        return jsonify({"status": "error", "message": "Missing Last Name"})
    if not 'first_name' in data: 
        return jsonify({"status": "error", "message": "Missing First Name"})  
    lastName = data.get('last_name')
    firstName = data.get('first_name')
    email = data.get('email')

    instance = conn.cursor()
    instance.execute('INSERT INTO users (last_name, first_name, email) VALUES (%s, %s, %s)', 
                     (lastName, firstName, email))
    conn.commit()
    newID = instance.lastrowid
    return jsonify({"status": "created", "id": newID})

@app.route("/api/get_all_scores", methods=['GET'])
def GetAllScore():

    pass
if __name__ == "__main__":
    app.run(debug=True)

