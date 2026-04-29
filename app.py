from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import pymysql
import flask_login
from flask_bcrypt import Bcrypt
from pymysql.cursors import DictCursor
import time

app = Flask(__name__)
app.secret_key = 'k573U@ge#%RyQ@DoTe5'
bcrypt = Bcrypt(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "Veuillez vous connecter pour accéder aux jeux."

# Configuration de la base de données
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'the_base',
    'cursorclass': DictCursor,
    'autocommit': True,
    'connect_timeout': 10,
    'read_timeout': 30,
    'write_timeout': 30
}

# Variable globale pour la connexion (sera réinitialisée si perdue)
_connection = None

def get_db_connection():
    """Récupère ou crée une connexion à la base de données"""
    global _connection
    try:
        if _connection is None:
            _connection = pymysql.connect(**DB_CONFIG)
        else:
            # Vérifier si la connexion est toujours active
            _connection.ping(reconnect=True)
    except (pymysql.err.InterfaceError, pymysql.err.OperationalError) as e:
        print(f"Reconnexion à la base de données : {e}")
        try:
            if _connection:
                _connection.close()
        except:
            pass
        _connection = pymysql.connect(**DB_CONFIG)
    
    return _connection

def close_db_connection(exception=None):
    """Ferme la connexion à la base de données"""
    global _connection
    if _connection:
        _connection.close()
        _connection = None

# Enregistrer la fermeture à la fin de chaque requête
app.teardown_appcontext(close_db_connection)

class User(flask_login.UserMixin):
    def __init__(self, id, email=None, first_name=None, last_name=None, balance=0.00):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.balance = balance

    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def user_loader(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, email, first_name, last_name, balance FROM users WHERE id = %s', (user_id,))
        user_data = cursor.fetchone()
        cursor.close()
        
        if user_data:
            return User(
                id=user_data['id'],
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                balance=float(user_data['balance'] or 0)
            )
    except Exception as e:
        print(f"Erreur user_loader: {e}")
    return None

# ---------- Fonctions utilitaires pour la balance ----------
def get_user_balance(user_id):
    """Récupère le solde actuel d'un utilisateur"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT balance FROM users WHERE id = %s', (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return float(result['balance']) if result else 0.00
    except Exception as e:
        print(f"Erreur get_user_balance: {e}")
        return 0.00

def update_balance(user_id, amount, game=None, transaction_type=None):
    """
    Met à jour le solde d'un utilisateur
    amount: montant à ajouter (positif pour gain, négatif pour perte)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Mise à jour du solde
        cursor.execute(
            'UPDATE users SET balance = balance + %s WHERE id = %s',
            (amount, user_id)
        )
        
        # Enregistrement de la transaction
        if game and transaction_type:
            try:
                cursor.execute(
                    'INSERT INTO transactions (user_id, amount, type, game) VALUES (%s, %s, %s, %s)',
                    (user_id, abs(amount), transaction_type, game)
                )
            except Exception as e:
                print(f"Erreur insertion transaction: {e}")
                # Continue même si la table transactions n'existe pas
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Erreur update_balance: {e}")
        try:
            conn.rollback()
        except:
            pass
        return False
    finally:
        cursor.close()

# ---------- Routes publiques ----------
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

# ---------- Routes protégées (jeux) ----------
@app.route("/wheelspin")
@flask_login.login_required
def wheelspin():
    balance = get_user_balance(flask_login.current_user.id)
    return render_template("wheelspin.html", balance=balance)

@app.route("/roulette")
@flask_login.login_required
def roulette():
    balance = get_user_balance(flask_login.current_user.id)
    return render_template("roulette.html", balance=balance)

@app.route("/slots")
@flask_login.login_required
def slots():
    balance = get_user_balance(flask_login.current_user.id)
    return render_template("slots.html", balance=balance)

@app.route("/blackjack")
@flask_login.login_required
def blackjack():
    balance = get_user_balance(flask_login.current_user.id)
    return render_template("blackjack.html", balance=balance)

# ---------- API Load Funds ----------
@app.route("/api/load_funds", methods=['POST'])
@flask_login.login_required
def api_load_funds():
    """
    Ajoute des fonds au compte de l'utilisateur
    Attend un JSON: {"amount": 50.00}
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid payload"}), 400
        
        amount = float(data.get('amount', 0))
        
        if amount <= 0:
            return jsonify({"status": "error", "message": "Amount must be positive"}), 400
        
        if amount > 10000:
            return jsonify({"status": "error", "message": "Maximum load amount is 10,000€"}), 400
        
        user_id = flask_login.current_user.id
        
        # Update balance
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE users SET balance = balance + %s WHERE id = %s',
            (amount, user_id)
        )
        
        # Record transaction as bonus/deposit
        cursor.execute(
            'INSERT INTO transactions (user_id, amount, type, game) VALUES (%s, %s, %s, %s)',
            (user_id, amount, 'bonus', 'deposit')
        )
        
        conn.commit()
        cursor.close()
        
        new_balance = get_user_balance(user_id)
        
        return jsonify({
            "status": "success",
            "message": f"Successfully loaded {amount:.2f}€",
            "new_balance": new_balance
        })
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid amount"}), 400
    except Exception as e:
        print(f"Error loading funds: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# ---------- Dashboard ----------
@app.route("/dashboard")
@flask_login.login_required
def dashboard():
    """Page de tableau de bord utilisateur"""
    user_id = flask_login.current_user.id
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Récupérer les statistiques
        cursor.execute('''
            SELECT 
                id, email, first_name, last_name, balance,
                (SELECT COUNT(*) FROM transactions WHERE user_id = %s) as total_games,
                (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = %s AND type = 'win') as total_wins,
                (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = %s AND type = 'loss') as total_losses
            FROM users WHERE id = %s
        ''', (user_id, user_id, user_id, user_id))
        user_stats = cursor.fetchone()
        
        # Récupérer les transactions
        cursor.execute('''
            SELECT amount, type, game, created_at 
            FROM transactions 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 20
        ''', (user_id,))
        transactions = cursor.fetchall()
        
        return render_template("dashboard.html", 
                             user=flask_login.current_user,
                             stats=user_stats,
                             transactions=transactions)
    except Exception as e:
        print(f"Erreur dashboard: {e}")
        # Valeurs par défaut si la table transactions n'existe pas
        return render_template("dashboard.html", 
                             user=flask_login.current_user,
                             stats={'balance': flask_login.current_user.balance, 'total_games': 0, 'total_wins': 0, 'total_losses': 0},
                             transactions=[])
    finally:
        cursor.close()

# ---------- Pages de confirmation ----------
@app.route("/login-success")
@flask_login.login_required
def login_success():
    return render_template("login-success.html", user=flask_login.current_user)

@app.route("/register-success")
def register_success():
    return render_template("register-success.html")

@app.route("/logout")
@flask_login.login_required
def logout():
    flask_login.logout_user()
    flash("Vous avez été déconnecté.", "info")
    return redirect(url_for("home"))

# ---------- API Balance ----------
@app.route("/api/get_balance", methods=['GET'])
@flask_login.login_required
def api_get_balance():
    """Retourne le solde actuel de l'utilisateur"""
    try:
        balance = get_user_balance(flask_login.current_user.id)
        return jsonify({"status": "success", "balance": balance})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/update_balance", methods=['POST'])
@flask_login.login_required
def api_update_balance():
    """
    Met à jour le solde après un jeu
    Attend un JSON: {"amount": 50.00, "game": "wheelspin", "type": "win"}
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid payload"}), 400
        
        amount = float(data.get('amount', 0))
        game = data.get('game', 'unknown')
        trans_type = data.get('type', 'win' if amount > 0 else 'loss')
        
        user_id = flask_login.current_user.id
        success = update_balance(user_id, amount, game, trans_type)
        
        if success:
            new_balance = get_user_balance(user_id)
            return jsonify({
                "status": "success",
                "message": "Balance updated",
                "new_balance": new_balance
            })
        else:
            return jsonify({"status": "error", "message": "Failed to update balance"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ---------- API Authentification ----------
def authenticate(email, password):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
        if cursor.rowcount == 0:
            return None
        user = cursor.fetchone()
        cursor.close()
        if bcrypt.check_password_hash(user['password_hash'], password):
            return user['id']
    except Exception as e:
        print(f"Erreur authenticate: {e}")
    return None

@app.route("/api/register_user", methods=['POST'])
def register_user():
    data = request.form
    if not data:
        return jsonify({"status": "error", "message": "Invalid payload"}), 400

    last_name = data.get('LastName')
    first_name = data.get('FirstName')
    email = data.get('Mail')
    password = data.get('Password')

    if not all([last_name, first_name, email, password]):
        return jsonify({"status": "error", "message": "Tous les champs sont requis"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (last_name, first_name, email, password_hash, balance) VALUES (%s, %s, %s, %s, 10.00)',
            (last_name, first_name, email, password_hash)
        )
        conn.commit()
        cursor.close()
    except pymysql.err.IntegrityError:
        return jsonify({"status": "error", "message": "Cet email est déjà utilisé."}), 400
    except Exception as e:
        print(f"Erreur register: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({"status": "success", "message": "Inscription réussie !"})

@app.route("/api/login_user", methods=['POST'])
def login_user():
    data = request.form
    email = data.get('email')
    password = data.get('password')
    user_id = authenticate(email, password)

    if user_id is None:
        return jsonify({"status": "error", "message": "Email ou mot de passe incorrect"}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, email, first_name, last_name, balance FROM users WHERE id = %s', (user_id,))
        user_data = cursor.fetchone()
        cursor.close()
        
        user = User(
            id=user_data['id'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            balance=float(user_data['balance'] or 0)
        )
        flask_login.login_user(user)
        return jsonify({"status": "success", "redirect": url_for("login_success")})
    except Exception as e:
        print(f"Erreur login_user: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/Confirmed', methods=["POST"])
def submit_legacy():
    email = request.form['email']
    password = request.form['password']
    user_id = authenticate(email, password)
    if user_id is None:
        return jsonify({'status': 'error', 'message': 'Identifiants incorrects'})
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, email, first_name, last_name, balance FROM users WHERE id = %s', (user_id,))
        user_data = cursor.fetchone()
        cursor.close()
        
        user = User(
            id=user_data['id'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            balance=float(user_data['balance'] or 0)
        )
        flask_login.login_user(user)
        return jsonify({'status': 'success', 'redirect': url_for("login_success")})
    except Exception as e:
        print(f"Erreur submit_legacy: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)