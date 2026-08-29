from flask import Blueprint, jsonify, request

from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Admin")
def admin_dashboard():

    return jsonify({
        "message": "Admin dashboard data",
        "user": request.user
    }), 200