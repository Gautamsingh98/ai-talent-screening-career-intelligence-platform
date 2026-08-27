from werkzeug.security import generate_password_hash
from database import get_db_connection


name = "Test Recruiter"
email = "recruiter@example.com"
password = "recruiter123"


connection = get_db_connection()
cursor = connection.cursor()


# Check whether recruiter already exists
cursor.execute(
    "SELECT id FROM users WHERE email = %s",
    (email,)
)

existing_user = cursor.fetchone()


if existing_user:

    print("Recruiter account already exists.")

else:

    hashed_password = generate_password_hash(password)

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password, role, status)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            name,
            email,
            hashed_password,
            "Recruiter",
            "Active"
        )
    )

    connection.commit()

    print("Recruiter account created successfully.")


cursor.close()
connection.close()