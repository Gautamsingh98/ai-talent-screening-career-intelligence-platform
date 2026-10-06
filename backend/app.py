from flask import Flask
from flask_cors import CORS

from routes.resume_routes import resume_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.recruiter_routes import recruiter_bp
from routes.candidate_routes import candidate_bp
from routes.interview_routes import interview_bp
from routes.notification_routes import notification_bp
from routes.recruiter_notification_routes import recruiter_notification_bp

app = Flask(__name__)


# =========================================================
# CORS CONFIGURATION
# =========================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"]
        }
    },
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False
)


# =========================================================
# AUTHENTICATION ROUTES
# =========================================================

app.register_blueprint(auth_bp)


# =========================================================
# RESUME ROUTES
# =========================================================

app.register_blueprint(resume_bp)


# =========================================================
# ADMIN ROUTES
# =========================================================

app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)


# =========================================================
# RECRUITER ROUTES
# =========================================================

app.register_blueprint(
    recruiter_bp,
    url_prefix="/api/recruiter"
)


# =========================================================
# CANDIDATE ROUTES
# =========================================================

app.register_blueprint(
    candidate_bp,
    url_prefix="/api/candidate"
)


# =========================================================
# INTERVIEW ROUTES
# =========================================================

app.register_blueprint(
    interview_bp,
    url_prefix="/api/interview"
)


# =========================================================
# NOTIFICATION ROUTES
# =========================================================

app.register_blueprint(notification_bp)

# =========================================================
#  RECRUITER NOTIFICATION ROUTES
# =========================================================
app.register_blueprint(recruiter_notification_bp)

# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return {
        "message": "AI Talent Screening Backend is running"
    }


# =========================================================
# RUN APPLICATION
# =========================================================

if __name__ == "__main__":
    app.run(debug=True)