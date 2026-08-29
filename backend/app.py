from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.recruiter_routes import recruiter_bp
from routes.candidate_routes import candidate_bp


app = Flask(__name__)

CORS(app)


# Authentication routes
app.register_blueprint(auth_bp)


# Role-based routes
app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)

app.register_blueprint(
    recruiter_bp,
    url_prefix="/api/recruiter"
)

app.register_blueprint(
    candidate_bp,
    url_prefix="/api/candidate"
)


@app.route("/")
def home():

    return {
        "message": "AI Talent Screening Backend is running"
    }


if __name__ == "__main__":
    app.run(debug=True)