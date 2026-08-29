from functools import wraps
from flask import jsonify, request


def role_required(*allowed_roles):

    def decorator(f):

        @wraps(f)
        def decorated(*args, **kwargs):

            user = getattr(request, "user", None)

            if not user:
                return jsonify({
                    "message": "Unauthorized"
                }), 401

            user_role = user.get("role")

            if user_role not in allowed_roles:
                return jsonify({
                    "message": "Access denied. You do not have permission to access this resource."
                }), 403

            return f(*args, **kwargs)

        return decorated

    return decorator