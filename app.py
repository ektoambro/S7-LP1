from flask import Flask, render_template, request# type: ignore

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("homepage.html")

@app.route("/about") 
def about(): 

 return render_template("about.html") 

@app.route("/login") 
def login(): 

 return render_template("login.html") 

@app.route('/submit', methods=["POST"]) 

def submit(): 

    username = request.form['fname'] 

    message = request.form['lname'] 

    return f"You are successfully logged on {username} "

if __name__ == "__main__":
    app.run(debug=True)

