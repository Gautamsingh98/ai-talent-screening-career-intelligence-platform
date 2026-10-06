from flask import Blueprint, jsonify, request
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


notification_bp = Blueprint(
    "notification",
    __name__,
    url_prefix="/api/candidate/notifications"
)


# =========================================================
# GET ALL NOTIFICATIONS
# =========================================================

@notification_bp.route("/", methods=["GET"])
@token_required
@role_required("Candidate")
def get_notifications():

    connection = None
    cursor = None

    try:
        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                type,
                title,
                message,
                related_id,
                is_read,
                created_at
            FROM notifications
            WHERE candidate_id = %s
            ORDER BY created_at DESC
            """,
            (candidate_id,)
        )

        notifications = cursor.fetchall()

        return jsonify({
            "success": True,
            "notifications": notifications
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# GET UNREAD COUNT
# =========================================================

@notification_bp.route("/unread-count", methods=["GET"])
@token_required
@role_required("Candidate")
def get_unread_count():

    connection = None
    cursor = None

    try:
        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT COUNT(*) AS unread_count
            FROM notifications
            WHERE candidate_id = %s
            AND is_read = FALSE
            """,
            (candidate_id,)
        )

        result = cursor.fetchone()

        return jsonify({
            "success": True,
            "unread_count": result["unread_count"]
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# MARK ONE NOTIFICATION AS READ
# =========================================================

@notification_bp.route("/<int:notification_id>/read", methods=["PUT"])
@token_required
@role_required("Candidate")
def mark_notification_read(notification_id):

    connection = None
    cursor = None

    try:
        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = %s
            AND candidate_id = %s
            """,
            (notification_id, candidate_id)
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Notification marked as read"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@notification_bp.route("/read-all", methods=["PUT"])
@token_required
@role_required("Candidate")
def mark_all_notifications_read():

    connection = None
    cursor = None

    try:
        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE notifications
            SET is_read = TRUE
            WHERE candidate_id = %s
            AND is_read = FALSE
            """,
            (candidate_id,)
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "All notifications marked as read"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()