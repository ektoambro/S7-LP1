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

    username = request.form['fname'] 

    message = request.form['lname'] 

    return f"You are successfully logged on {username} "

if __name__ == "__main__":
    app.run(debug=True)

