from flask import Blueprint, jsonify, request

from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


candidate_bp = Blueprint("candidate", __name__)


@candidate_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_dashboard():

    return jsonify({
        "message": "Candidate dashboard data",
        "user": request.user
    }), 200