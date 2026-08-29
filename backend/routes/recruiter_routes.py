from flask import Blueprint, jsonify, request

from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


recruiter_bp = Blueprint("recruiter", __name__)


@recruiter_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_dashboard():

    return jsonify({
        "message": "Recruiter dashboard data",
        "user": request.user
    }), 200