from flask import Flask, render_template, request, redirect, url_for

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

@app.route("/confirmed-login") 
def confirmed_login(): 
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

if __name__ == "__main__":
    app.run(debug=True)