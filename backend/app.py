from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return {
        "message": "AI Talent Screening Backend is running"
    }


if __name__ == "__main__":
    app.run(debug=True)