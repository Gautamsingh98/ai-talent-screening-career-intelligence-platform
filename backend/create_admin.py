from werkzeug.security import generate_password_hash
from database import get_db_connection


name = "System Admin"
email = "admin@example.com"
password = "admin123"


connection = get_db_connection()
cursor = connection.cursor()


# Check whether admin already exists
cursor.execute(
    "SELECT id FROM users WHERE email = %s",
    (email,)
)

existing_user = cursor.fetchone()


if existing_user:

    print("Admin account already exists.")

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
            "Admin",
            "Active"
        )
    )

    connection.commit()

    print("Admin account created successfully.")


cursor.close()
connection.close()