from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from database import get_db_connection
from middleware.auth_middleware import token_required
from resume_parser import extract_text_from_pdf
from resume_analyzer import analyze_resume

import os
import uuid


resume_bp = Blueprint(
    "resume",
    __name__,
    url_prefix="/api/resume"
)


# =========================
# UPLOAD RESUME
# =========================

@resume_bp.route("/upload", methods=["POST"])
@token_required
def upload_resume():

    # Check file
    if "resume" not in request.files:

        return jsonify({
            "message": "No resume file provided"
        }), 400


    file = request.files["resume"]


    # Check filename
    if file.filename == "":

        return jsonify({
            "message": "No file selected"
        }), 400


    # Only PDF
    if not file.filename.lower().endswith(".pdf"):

        return jsonify({
            "message": "Only PDF files are allowed"
        }), 400


    connection = None
    cursor = None

    try:

        # =========================
        # UPLOAD FOLDER
        # =========================

        upload_folder = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "uploads"
        )

        os.makedirs(
            upload_folder,
            exist_ok=True
        )


        # =========================
        # FILE NAME
        # =========================

        original_filename = secure_filename(
            file.filename
        )

        unique_filename = (
            str(uuid.uuid4())
            + "_"
            + original_filename
        )


        file_path = os.path.join(
            upload_folder,
            unique_filename
        )


        # =========================
        # SAVE PDF
        # =========================

        file.save(file_path)


        # =========================
        # EXTRACT TEXT
        # =========================

        extracted_text = extract_text_from_pdf(
            file_path
        )


        # =========================
        # DATABASE
        # =========================

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute(
            """
            INSERT INTO resumes
            (
                user_id,
                original_filename,
                stored_filename,
                file_path,
                extracted_text
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                request.user["user_id"],
                original_filename,
                unique_filename,
                file_path,
                extracted_text
            )
        )


        connection.commit()


        # =========================
        # RESPONSE
        # =========================

        return jsonify({

            "message":
                "Resume uploaded and text extracted successfully",

            "filename":
                original_filename,

            "text_length":
                len(extracted_text)

        }), 201


    except Exception as e:

        if connection:
            connection.rollback()

        return jsonify({

            "message":
                "Resume upload failed",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================
# GET MY RESUME
# =========================

@resume_bp.route("/my-resume", methods=["GET"])
@token_required
def get_my_resume():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                original_filename,
                stored_filename,
                file_path,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
            """,
            (request.user["user_id"],)
        )

        resume = cursor.fetchone()

        if not resume:

            return jsonify({
                "message": "No resume found"
            }), 404


        return jsonify({
            "message": "Resume retrieved successfully",
            "resume": resume
        }), 200


    except Exception as e:

        return jsonify({
            "message": "Failed to retrieve resume",
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================
# ANALYZE MY RESUME
# =========================

@resume_bp.route("/analyze", methods=["GET"])
@token_required
def analyze_my_resume():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                original_filename,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
            """,
            (request.user["user_id"],)
        )

        resume = cursor.fetchone()


        if not resume:

            return jsonify({
                "message": "No resume found"
            }), 404


        extracted_text = resume["extracted_text"]


        if not extracted_text:

            return jsonify({
                "message": "No extracted text found"
            }), 400


        # Analyze resume

        analysis = analyze_resume(
            extracted_text
        )


        return jsonify({

            "message":
                "Resume analyzed successfully",

            "resume": {

                "id":
                    resume["id"],

                "filename":
                    resume["original_filename"],

                "uploaded_at":
                    resume["uploaded_at"],

            },

            "analysis": analysis

        }), 200


    except Exception as e:

        return jsonify({

            "message":
                "Resume analysis failed",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()