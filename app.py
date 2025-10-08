from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about") 
def about(): 

 return render_template("about.html") 

from flask import Flask, request, render_template 

@app.route('/submit', methods=["POST"]) 

def submit(): 

    username = request.form['fname'] 

    message = request.form['lname'] 

    return f"You are successfully logged on {username} "

if __name__ == "__main__":
    app.run(debug=True)

