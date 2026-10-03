from flask import Blueprint, jsonify, request

from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required

from utils.interview_evaluator import evaluate_answer


# =========================================================
# INTERVIEW BLUEPRINT
# =========================================================

interview_bp = Blueprint("interview", __name__)

# =====================================================
# GET ACTIVE JOBS FOR INTERVIEW
# =====================================================

@interview_bp.route(
    "/jobs",
    methods=["GET"]
)
@token_required
@role_required("Candidate")
def get_interview_jobs():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        query = """
            SELECT
                id,
                title,
                description,
                required_skills,
                experience,
                location
            FROM jobs
            WHERE status = 'Active'
            ORDER BY title ASC
        """

        cursor.execute(query)

        jobs = cursor.fetchall()

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except Exception as e:

        print(
            "Get interview jobs error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Failed to load interview jobs.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# START INTERVIEW
# =========================================================

@interview_bp.route("/start", methods=["POST"])
@token_required
@role_required("Candidate")
def start_interview():

    connection = None
    cursor = None

    try:

        # Logged-in candidate
        user_id = request.user["user_id"]

        # Get frontend data
        data = request.get_json()
        print("Received interview data:", data)

        job_role = data.get("job_role")
        difficulty = data.get("difficulty")

        # Validate
        if not job_role:
            return jsonify({
                "success": False,
                "message": "Job role is required."
            }), 400

        if not difficulty:
            return jsonify({
                "success": False,
                "message": "Difficulty level is required."
            }), 400

        # Database connection
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Create interview
        query = """
            INSERT INTO interviews
            (
                candidate_id,
                job_role,
                difficulty,
                total_questions,
                current_question,
                total_score,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                user_id,
                job_role,
                difficulty,
                5,
                1,
                0,
                "Started"
            )
        )

        # Get newly created interview ID
        interview_id = cursor.lastrowid

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Interview started successfully.",
            "interview_id": interview_id,
            "job_role": job_role,
            "difficulty": difficulty,
            "total_questions": 5
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("Start interview error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to start interview.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# INTERVIEW QUESTION BANK
# =========================================================

QUESTION_BANK = {

"Data Science Associate": {

    "Beginner": [
        {
            "question": "What is data science?",
            "correct_answer": "Data science is the field of using statistics, programming, machine learning, and data analysis techniques to extract useful insights and support decision making from data."
        },
        {
            "question": "What is the difference between data analysis and data science?",
            "correct_answer": "Data analysis focuses mainly on examining and interpreting existing data to find insights, while data science includes data analysis as well as machine learning, predictive modeling, programming, and building data-driven solutions."
        },
        {
            "question": "What is the purpose of data preprocessing?",
            "correct_answer": "Data preprocessing prepares raw data for analysis or machine learning by handling missing values, removing duplicates, correcting errors, transforming variables, and scaling numerical features when necessary."
        },
        {
            "question": "What is a feature in a machine learning dataset?",
            "correct_answer": "A feature is an input variable or characteristic used by a machine learning model to make predictions or identify patterns."
        },
        {
            "question": "What is exploratory data analysis?",
            "correct_answer": "Exploratory data analysis is the process of examining and visualizing data using statistics and charts to understand distributions, relationships, patterns, missing values, and outliers."
        }
    ],

    "Intermediate": [
        {
            "question": "How would you handle missing values in a dataset?",
            "correct_answer": "Missing values can be handled by removing affected rows or columns when appropriate, replacing values using mean median or mode, using forward or backward filling, or applying more advanced imputation methods depending on the dataset."
        },
        {
            "question": "What is the difference between classification and regression?",
            "correct_answer": "Classification predicts categorical values such as spam or not spam, while regression predicts continuous numerical values such as house prices or sales."
        },
        {
            "question": "What is overfitting and how can it be prevented?",
            "correct_answer": "Overfitting occurs when a model learns the training data too closely and performs poorly on unseen data. It can be reduced using cross-validation, regularization, simpler models, feature selection, pruning, or more training data."
        },
        {
            "question": "Why is feature scaling important in machine learning?",
            "correct_answer": "Feature scaling puts numerical features on comparable scales and prevents features with larger numerical ranges from dominating algorithms that are sensitive to feature magnitude."
        },
        {
            "question": "What is the purpose of train test splitting?",
            "correct_answer": "Train test splitting separates data into training and testing sets so that a model can learn from the training data and then be evaluated on unseen testing data."
        }
    ],

    "Advanced": [
        {
            "question": "How would you evaluate a machine learning classification model?",
            "correct_answer": "A classification model can be evaluated using accuracy precision recall F1 score ROC-AUC and a confusion matrix. The appropriate metric depends on the business problem and the cost of false positive and false negative predictions."
        },
        {
            "question": "What is data leakage and why is it a problem?",
            "correct_answer": "Data leakage occurs when information that should not be available during model training is accidentally included in the training process. It can produce unrealistically high evaluation results and poor performance on real-world data."
        },
        {
            "question": "How would you detect and handle outliers?",
            "correct_answer": "Outliers can be detected using box plots, interquartile range, z scores, scatter plots, or domain knowledge. They can be removed, transformed, capped, or retained depending on whether they represent errors or meaningful observations."
        },
        {
            "question": "What is cross-validation and why is it useful?",
            "correct_answer": "Cross-validation divides the dataset into multiple subsets and repeatedly trains and evaluates a model using different subsets. It provides a more reliable estimate of model performance and helps reduce dependence on a single train test split."
        },
        {
            "question": "How would you improve a machine learning model that performs poorly on unseen data?",
            "correct_answer": "The model can be improved by checking data quality, handling missing values and outliers, engineering useful features, selecting appropriate algorithms, tuning hyperparameters, using cross-validation, preventing data leakage, and addressing overfitting or underfitting."
        }
    ]
},

    # "Data Scientist": {

    #     "Beginner": [
    #         {
    #             "question": "What is supervised learning? Give one real-world example.",
    #             "correct_answer": "Supervised learning is a machine learning approach where a model learns from labeled training data. A real-world example is email spam classification, where emails are classified as spam or not spam."
    #         },
    #         {
    #             "question": "What is the difference between classification and regression?",
    #             "correct_answer": "Classification predicts a categorical value such as spam or not spam, while regression predicts a continuous numerical value such as house price or salary."
    #         },
    #         {
    #             "question": "What is overfitting in machine learning?",
    #             "correct_answer": "Overfitting occurs when a machine learning model learns the training data too closely, including noise, and performs well on training data but poorly on unseen data."
    #         },
    #         {
    #             "question": "What is a feature in machine learning?",
    #             "correct_answer": "A feature is an input variable or measurable characteristic used by a machine learning model to make predictions. For example, house size can be a feature when predicting house prices."
    #         },
    #         {
    #             "question": "What is the purpose of splitting a dataset into training and testing sets?",
    #             "correct_answer": "The training set is used to train the machine learning model, while the testing set is used to evaluate how well the trained model performs on unseen data."
    #         }
    #     ],

    #     "Intermediate": [
    #         {
    #             "question": "What is cross-validation and why is it used?",
    #             "correct_answer": "Cross-validation is a model evaluation technique that divides data into multiple subsets and trains and evaluates the model multiple times. It helps estimate model performance more reliably and reduce dependence on a single train-test split."
    #         },
    #         {
    #             "question": "What is the bias-variance tradeoff?",
    #             "correct_answer": "The bias-variance tradeoff describes the balance between underfitting and overfitting. High bias can cause underfitting, while high variance can cause overfitting."
    #         },
    #         {
    #             "question": "What is feature engineering?",
    #             "correct_answer": "Feature engineering is the process of creating, transforming, or selecting input features to improve machine learning model performance."
    #         },
    #         {
    #             "question": "What is precision and recall?",
    #             "correct_answer": "Precision measures how many predicted positive cases are actually positive, while recall measures how many actual positive cases were correctly identified."
    #         },
    #         {
    #             "question": "What is the purpose of normalization?",
    #             "correct_answer": "Normalization scales numerical features to a common range so that features with larger numerical values do not disproportionately influence certain machine learning algorithms."
    #         }
    #     ],

    #     "Advanced": [
    #         {
    #             "question": "What is regularization in machine learning?",
    #             "correct_answer": "Regularization is a technique used to reduce overfitting by adding a penalty to model complexity. Common methods include L1 and L2 regularization."
    #         },
    #         {
    #             "question": "Explain the difference between L1 and L2 regularization.",
    #             "correct_answer": "L1 regularization adds a penalty based on the absolute values of model coefficients and can produce sparse models. L2 regularization adds a penalty based on squared coefficients and generally reduces coefficient magnitude."
    #         },
    #         {
    #             "question": "What is gradient descent?",
    #             "correct_answer": "Gradient descent is an optimization algorithm that iteratively adjusts model parameters in the direction that reduces the loss function."
    #         },
    #         {
    #             "question": "What is data leakage?",
    #             "correct_answer": "Data leakage occurs when information from outside the training data, especially information from the validation or test set, unintentionally influences model training and produces overly optimistic evaluation results."
    #         },
    #         {
    #             "question": "How would you handle an imbalanced classification dataset?",
    #             "correct_answer": "An imbalanced dataset can be handled using techniques such as class weighting, oversampling minority classes, undersampling majority classes, SMOTE, and evaluation metrics such as precision, recall, F1-score, and ROC-AUC."
    #         }
    #     ]
    # },

"Data Analyst": {

    "Beginner": [
        {
            "question": "What is data analysis?",
            "correct_answer": "Data analysis is the process of inspecting, cleaning, transforming, and interpreting data to discover useful information and support decision making."
        },
        {
            "question": "What is the difference between mean, median, and mode?",
            "correct_answer": "Mean is the average of all values, median is the middle value when data is ordered, and mode is the value that occurs most frequently."
        },
        {
            "question": "What is a dataset?",
            "correct_answer": "A dataset is a structured collection of related data that can contain rows representing records and columns representing variables or attributes."
        },
        {
            "question": "What is data cleaning?",
            "correct_answer": "Data cleaning is the process of identifying and correcting missing values, duplicate records, incorrect formats, and inconsistent or invalid data."
        },
        {
            "question": "What is data visualization?",
            "correct_answer": "Data visualization is the graphical representation of data using charts, graphs, and other visual elements to make patterns and trends easier to understand."
        }
    ],

    "Intermediate": [
        {
            "question": "What is the difference between correlation and causation?",
            "correct_answer": "Correlation means two variables are related or change together, while causation means a change in one variable directly produces a change in another variable."
        },
        {
            "question": "How do you handle missing values in a dataset?",
            "correct_answer": "Missing values can be handled by removing rows or columns, filling values using mean median or mode, forward or backward filling, or using machine learning based imputation depending on the data."
        },
        {
            "question": "What is an outlier?",
            "correct_answer": "An outlier is an observation that is significantly different from the other observations in a dataset."
        },
        {
            "question": "What is exploratory data analysis?",
            "correct_answer": "Exploratory data analysis is the process of investigating a dataset using statistics and visualizations to understand distributions, relationships, patterns, missing values, and outliers."
        },
        {
            "question": "What is SQL used for in data analysis?",
            "correct_answer": "SQL is used to retrieve, filter, join, aggregate, update, and analyze data stored in relational databases."
        }
    ],

    "Advanced": [
        {
            "question": "How would you optimize a slow SQL query?",
            "correct_answer": "A slow SQL query can be optimized by examining the execution plan, adding appropriate indexes, avoiding unnecessary columns, optimizing joins and filters, reducing unnecessary subqueries, and improving database design where necessary."
        },
        {
            "question": "What is the difference between inner join and left join?",
            "correct_answer": "An inner join returns only rows that have matching values in both tables, while a left join returns all rows from the left table and matching rows from the right table, using null values when no match exists."
        },
        {
            "question": "What is statistical significance?",
            "correct_answer": "Statistical significance indicates whether an observed relationship or difference is unlikely to have occurred by random chance under a specified statistical hypothesis."
        },
        {
            "question": "How would you detect anomalies in a dataset?",
            "correct_answer": "Anomalies can be detected using statistical methods such as z scores and interquartile range, visualization techniques, clustering methods, isolation forest, or other anomaly detection algorithms."
        },
        {
            "question": "How would you present analytical results to non-technical stakeholders?",
            "correct_answer": "Analytical results should be presented using clear business-focused language, relevant visualizations, key findings, measurable impact, and actionable recommendations while avoiding unnecessary technical complexity."
        }
    ]
},

"Junior Machine Learning Analyst": {

    "Beginner": [
        {
            "question": "What is machine learning?",
            "correct_answer": "Machine learning is a branch of artificial intelligence where computers learn patterns from data and use those patterns to make predictions or decisions."
        },
        {
            "question": "What is the difference between supervised and unsupervised learning?",
            "correct_answer": "Supervised learning uses labeled data to learn a mapping between inputs and outputs, while unsupervised learning works with unlabeled data to discover patterns or groups."
        },
        {
            "question": "What is a training dataset?",
            "correct_answer": "A training dataset is the portion of data used by a machine learning algorithm to learn patterns and model parameters."
        },
        {
            "question": "What is a target variable?",
            "correct_answer": "A target variable is the output or value that a machine learning model is trained to predict."
        },
        {
            "question": "What is a machine learning feature?",
            "correct_answer": "A feature is an input variable or measurable characteristic used by a machine learning model to make predictions."
        }
    ],

    "Intermediate": [
        {
            "question": "What is the difference between training, validation, and testing data?",
            "correct_answer": "Training data is used to learn model parameters, validation data is used to tune and select models, and testing data is used to evaluate final performance on unseen data."
        },
        {
            "question": "What is overfitting?",
            "correct_answer": "Overfitting occurs when a machine learning model learns the training data too closely, including noise, and therefore performs poorly on unseen data."
        },
        {
            "question": "What is feature scaling?",
            "correct_answer": "Feature scaling transforms numerical features to comparable ranges so that features with larger numerical values do not disproportionately influence certain machine learning algorithms."
        },
        {
            "question": "What is accuracy?",
            "correct_answer": "Accuracy is the proportion of correct predictions among all predictions made by a classification model."
        },
        {
            "question": "What is cross-validation?",
            "correct_answer": "Cross-validation is a model evaluation technique that divides data into multiple subsets and repeatedly trains and evaluates the model to obtain a more reliable estimate of performance."
        }
    ],

    "Advanced": [
        {
            "question": "How would you handle an imbalanced classification dataset?",
            "correct_answer": "An imbalanced dataset can be handled using class weights, oversampling, undersampling, SMOTE, and appropriate evaluation metrics such as precision, recall, F1 score, and ROC-AUC."
        },
        {
            "question": "What is hyperparameter tuning?",
            "correct_answer": "Hyperparameter tuning is the process of finding suitable model configuration values such as learning rate, tree depth, or number of estimators to improve model performance."
        },
        {
            "question": "What is data leakage?",
            "correct_answer": "Data leakage occurs when information that should not be available during model training is accidentally used, resulting in overly optimistic evaluation results."
        },
        {
            "question": "How do you select an appropriate machine learning evaluation metric?",
            "correct_answer": "The evaluation metric should be selected based on the problem type, business objective, class distribution, and cost of different prediction errors."
        },
        {
            "question": "How would you improve a machine learning model with poor performance?",
            "correct_answer": "Model performance can be improved by checking data quality, engineering useful features, selecting appropriate algorithms, tuning hyperparameters, handling class imbalance, preventing leakage, and using proper validation techniques."
        }
    ]
},

    "Python Developer": {

        "Beginner": [
            {
                "question": "What is Python and why is it widely used?",
                "correct_answer": "Python is a high-level, interpreted programming language known for its readable syntax and large ecosystem of libraries. It is widely used in web development, automation, data science, machine learning, and scripting."
            },
            {
                "question": "What is a list in Python?",
                "correct_answer": "A list is an ordered and mutable collection in Python that can contain multiple values, including values of different data types."
            },
            {
                "question": "What is the difference between a list and a tuple?",
                "correct_answer": "A list is mutable, meaning its elements can be changed after creation, while a tuple is immutable."
            },
            {
                "question": "What is a function in Python?",
                "correct_answer": "A function is a reusable block of code that performs a specific task and can accept inputs and return an output."
            },
            {
                "question": "What is exception handling?",
                "correct_answer": "Exception handling is a mechanism for handling runtime errors using constructs such as try, except, else, and finally."
            }
        ],

        "Intermediate": [
            {
                "question": "What are decorators in Python?",
                "correct_answer": "Decorators are functions that modify or extend the behavior of another function or class without directly changing its source code."
            },
            {
                "question": "What is a Python virtual environment?",
                "correct_answer": "A virtual environment is an isolated Python environment that allows a project to use its own dependencies and package versions."
            },
            {
                "question": "What is list comprehension?",
                "correct_answer": "List comprehension is a concise Python syntax for creating a list by applying an expression to each item in an iterable, optionally using a condition."
            },
            {
                "question": "What is the difference between shallow copy and deep copy?",
                "correct_answer": "A shallow copy creates a new outer object while nested objects may still be shared, whereas a deep copy recursively creates independent copies of nested objects."
            },
            {
                "question": "What is an API?",
                "correct_answer": "An API is an interface that allows different software applications or components to communicate with each other through defined requests and responses."
            }
        ],

        "Advanced": [
            {
                "question": "What are generators in Python?",
                "correct_answer": "Generators are functions that produce values lazily using yield, allowing iteration over potentially large data without storing all values in memory at once."
            },
            {
                "question": "What is the Global Interpreter Lock?",
                "correct_answer": "The Global Interpreter Lock, or GIL, is a mechanism in CPython that allows only one thread to execute Python bytecode at a time."
            },
            {
                "question": "What is asynchronous programming in Python?",
                "correct_answer": "Asynchronous programming allows tasks that spend time waiting, such as network operations, to be managed without blocking the execution of other asynchronous tasks."
            },
            {
                "question": "What is multiprocessing?",
                "correct_answer": "Multiprocessing uses separate processes to execute tasks independently and can achieve parallel CPU-bound execution without being restricted by the CPython GIL."
            },
            {
                "question": "How can Python application performance be optimized?",
                "correct_answer": "Performance can be improved by profiling the application, optimizing algorithms and data structures, reducing unnecessary operations, using caching, efficient database queries, asynchronous processing, and appropriate concurrency techniques."
            }
        ]
    },

    # "AI Engineer": {

    #     "Beginner": [
    #         {
    #             "question": "What is artificial intelligence?",
    #             "correct_answer": "Artificial intelligence is the field of creating systems that can perform tasks that normally require human intelligence, such as learning, reasoning, perception, and decision-making."
    #         },
    #         {
    #             "question": "What is machine learning?",
    #             "correct_answer": "Machine learning is a subset of artificial intelligence where systems learn patterns from data and use those patterns to make predictions or decisions."
    #         },
    #         {
    #             "question": "What is deep learning?",
    #             "correct_answer": "Deep learning is a subset of machine learning that uses neural networks with multiple layers to learn complex patterns from data."
    #         },
    #         {
    #             "question": "What is a neural network?",
    #             "correct_answer": "A neural network is a machine learning model inspired by the structure of biological neural networks and consists of interconnected layers of computational units."
    #         },
    #         {
    #             "question": "What is NLP?",
    #             "correct_answer": "Natural Language Processing is a field of AI focused on enabling computers to process, understand, and generate human language."
    #         }
    #     ],

    #     "Intermediate": [
    #         {
    #             "question": "What is an embedding?",
    #             "correct_answer": "An embedding is a numerical vector representation of data such as text that captures semantic or meaningful relationships between items."
    #         },
    #         {
    #             "question": "What is transfer learning?",
    #             "correct_answer": "Transfer learning uses knowledge learned from one task or dataset as a starting point for solving another related task."
    #         },
    #         {
    #             "question": "What is a transformer model?",
    #             "correct_answer": "A transformer is a neural network architecture that uses attention mechanisms to process relationships between elements in sequential or structured data."
    #         },
    #         {
    #             "question": "What is fine-tuning?",
    #             "correct_answer": "Fine-tuning is the process of further training a pretrained model on a specific dataset or task so that it performs better for that target task."
    #         },
    #         {
    #             "question": "What is model evaluation?",
    #             "correct_answer": "Model evaluation is the process of measuring how well a machine learning model performs using appropriate metrics on validation or unseen test data."
    #         }
    #     ],

    #     "Advanced": [
    #         {
    #             "question": "Explain attention in transformer models.",
    #             "correct_answer": "Attention allows a model to assign different importance to different parts of an input when producing an output representation. Self-attention allows each token to consider relationships with other tokens."
    #         },
    #         {
    #             "question": "What is Retrieval-Augmented Generation?",
    #             "correct_answer": "Retrieval-Augmented Generation combines information retrieval with generative models by retrieving relevant external information and providing it to the model as context for generating an answer."
    #         },
    #         {
    #             "question": "What is hallucination in generative AI?",
    #             "correct_answer": "A hallucination occurs when a generative AI system produces information that appears plausible but is inaccurate, unsupported, or fabricated."
    #         },
    #         {
    #             "question": "How can an AI model be deployed?",
    #             "correct_answer": "An AI model can be deployed through APIs, web applications, batch processing systems, cloud services, containers, or edge devices depending on the application's requirements."
    #         },
    #         {
    #             "question": "What is model monitoring?",
    #             "correct_answer": "Model monitoring tracks deployed model performance, data quality, latency, errors, and changes in data distributions to identify degradation or operational problems."
    #         }
    #     ]
    # },

#     "Web Developer": {
#         "Beginner": [
#             {
#                 "question": "What is HTML?",
#                 "correct_answer": "HTML is a markup language used to structure content on web pages."
#             },
#             {
#                 "question": "What is CSS?",
#                 "correct_answer": "CSS is a stylesheet language used to control the appearance, layout, and presentation of web pages."
#             },
#             {
#                 "question": "What is JavaScript?",
#                 "correct_answer": "JavaScript is a programming language commonly used to add interactive and dynamic behavior to web pages and applications."
#             },
#             {
#                 "question": "What is responsive web design?",
#                 "correct_answer": "Responsive web design is an approach that makes websites adapt their layout and content to different screen sizes and devices."
#             },
#             {
#                 "question": "What is an HTTP request?",
#                 "correct_answer": "An HTTP request is a message sent by a client to a server asking for a resource or requesting an operation."
#             }
#         ],

#         "Intermediate": [
#             {
#                 "question": "What is REST API?",
#                 "correct_answer": "A REST API is an HTTP-based interface that exposes resources through endpoints and commonly uses methods such as GET, POST, PUT, PATCH, and DELETE."
#             },
#             {
#                 "question": "What is React?",
#                 "correct_answer": "React is a JavaScript library for building user interfaces using reusable components and state-driven rendering."
#             },
#             {
#                 "question": "What is state in React?",
#                 "correct_answer": "State is data managed by a React component that can change over time and cause the component to re-render."
#             },
#             {
#                 "question": "What is authentication?",
#                 "correct_answer": "Authentication is the process of verifying the identity of a user or system."
#             },
#             {
#                 "question": "What is authorization?",
#                 "correct_answer": "Authorization determines what an authenticated user or system is allowed to access or perform."
#             }
#         ],

#         "Advanced": [
#             {
#                 "question": "What is JWT authentication?",
#                 "correct_answer": "JWT authentication uses a digitally signed JSON Web Token to represent claims about an authenticated user and allows the server to verify the token on subsequent requests."
#             },
#             {
#                 "question": "What is CORS?",
#                 "correct_answer": "Cross-Origin Resource Sharing is a browser security mechanism that controls whether a web application from one origin can access resources from another origin."
#             },
#             {
#                 "question": "What is database indexing?",
#                 "correct_answer": "A database index is a data structure that improves the speed of data retrieval for selected columns, usually at the cost of additional storage and write overhead."
#             },
#             {
#                 "question": "What is caching?",
#                 "correct_answer": "Caching stores frequently accessed data in a faster storage layer so future requests can be served more quickly and reduce repeated computation or database access."
#             },
#             {
#                 "question": "How can a web application be secured?",
#                 "correct_answer": "A web application can be secured using strong authentication and authorization, input validation, parameterized queries, HTTPS, secure password hashing, proper session management, CSRF protection where applicable, and secure handling of sensitive data."
#             }
#         ]
#     }
}


# =========================================================
# GET CURRENT INTERVIEW QUESTION
# =========================================================

@interview_bp.route(
    "/<int:interview_id>/question",
    methods=["GET"]
)
@token_required
@role_required("Candidate")
def get_interview_question(interview_id):

    connection = None
    cursor = None

    try:

        user_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get interview
        # -------------------------------------------------

        query = """
            SELECT
                id,
                candidate_id,
                job_role,
                difficulty,
                total_questions,
                current_question,
                status
            FROM interviews
            WHERE id = %s
              AND candidate_id = %s
        """

        cursor.execute(query, (interview_id, user_id))
        interview = cursor.fetchone()

        if not interview:
            return jsonify({
                "success": False,
                "message": "Interview not found."
            }), 404

        # -------------------------------------------------
        # Check interview status
        # -------------------------------------------------

        if interview["status"] == "Completed":
            return jsonify({
                "success": False,
                "message": "This interview has already been completed."
            }), 400

        # -------------------------------------------------
        # Get question list
        # -------------------------------------------------

        job_role = interview["job_role"]
        difficulty = interview["difficulty"]

        questions = QUESTION_BANK.get(
            job_role,
            {}
        ).get(
            difficulty,
            []
        )

        if not questions:
            return jsonify({
                "success": False,
                "message": "No questions available for this job role and difficulty."
            }), 404

        question_number = interview["current_question"]

        if question_number > len(questions):
            return jsonify({
                "success": False,
                "message": "All questions have been completed."
            }), 400

        # -------------------------------------------------
        # Get question data
        # -------------------------------------------------

        question_data = questions[question_number - 1]

        question_text = question_data["question"]

        correct_answer = question_data["correct_answer"]

        # -------------------------------------------------
        # Check if question already exists
        # -------------------------------------------------

        query = """
            SELECT
                id,
                question_number,
                question_text,
                candidate_answer,
                score,
                feedback,
                correct_answer
            FROM interview_questions
            WHERE interview_id = %s
              AND question_number = %s
        """

        cursor.execute(
            query,
            (
                interview_id,
                question_number
            )
        )

        existing_question = cursor.fetchone()

        # -------------------------------------------------
        # Create question if it does not exist
        # -------------------------------------------------

        if not existing_question:

            query = """
                INSERT INTO interview_questions
                (
                    interview_id,
                    question_number,
                    question_text,
                    correct_answer
                )
                VALUES (%s, %s, %s, %s)
            """

            cursor.execute(
                query,
                (
                    interview_id,
                    question_number,
                    question_text,
                    correct_answer
                )
            )

            connection.commit()

            question_id = cursor.lastrowid

        else:

            question_id = existing_question["id"]

            # -------------------------------------------------
            # Update correct answer for old question
            # -------------------------------------------------

            if not existing_question["correct_answer"]:

                update_query = """
                    UPDATE interview_questions
                    SET correct_answer = %s
                    WHERE id = %s
                """

                cursor.execute(
                    update_query,
                    (
                        correct_answer,
                        question_id
                    )
                )

                connection.commit()

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({
            "success": True,
            "interview_id": interview_id,
            "question": {
                "id": question_id,
                "question_number": question_number,
                "total_questions": interview["total_questions"],
                "question_text": question_text
            }
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("Get interview question error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to get interview question.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# SUBMIT INTERVIEW ANSWER
# =========================================================

@interview_bp.route(
    "/question/<int:question_id>/answer",
    methods=["POST"]
)
@token_required
@role_required("Candidate")
def submit_interview_answer(question_id):

    connection = None
    cursor = None

    try:

        user_id = request.user["user_id"]

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        answer = data.get("answer")

        if not answer or not answer.strip():
            return jsonify({
                "success": False,
                "message": "Answer is required."
            }), 400

        # -------------------------------------------------
        # Database connection
        # -------------------------------------------------

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get question and verify candidate ownership
        # -------------------------------------------------

        query = """
            SELECT
                iq.id,
                iq.interview_id,
                iq.question_number,
                iq.question_text,
                iq.correct_answer,
                iq.candidate_answer,
                i.candidate_id,
                i.job_role,
                i.difficulty,
                i.current_question,
                i.total_questions,
                i.status
            FROM interview_questions iq
            INNER JOIN interviews i
                ON iq.interview_id = i.id
            WHERE iq.id = %s
              AND i.candidate_id = %s
        """

        cursor.execute(
            query,
            (
                question_id,
                user_id
            )
        )

        question = cursor.fetchone()

        if not question:
            return jsonify({
                "success": False,
                "message": "Interview question not found."
            }), 404

        # -------------------------------------------------
        # Check interview status
        # -------------------------------------------------

        if question["status"] == "Completed":

            return jsonify({
                "success": False,
                "message": "This interview has already been completed."
            }), 400

        # -------------------------------------------------
        # Prevent submitting the same answer twice
        # -------------------------------------------------

        if question["candidate_answer"]:

            return jsonify({
                "success": False,
                "message": "Answer has already been submitted for this question."
            }), 400

        # -------------------------------------------------
        # Check correct answer
        # -------------------------------------------------

        if not question["correct_answer"]:

            return jsonify({
                "success": False,
                "message": "Correct answer is not available for this question."
            }), 500

        # -------------------------------------------------
        # AI EVALUATION
        # -------------------------------------------------

        evaluation = evaluate_answer(
            answer,
            question["question_text"],
            question["correct_answer"],
            question["job_role"]
        )

        score = int(evaluation["score"])
        feedback = evaluation["feedback"]

        # -------------------------------------------------
        # Save answer and evaluation
        # -------------------------------------------------

        update_query = """
            UPDATE interview_questions
            SET
                candidate_answer = %s,
                score = %s,
                feedback = %s
            WHERE id = %s
        """

        cursor.execute(
            update_query,
            (
                answer.strip(),
                score,
                feedback,
                question_id
            )
        )

        # -------------------------------------------------
        # Calculate next question
        # -------------------------------------------------

        next_question = (
            question["question_number"] + 1
        )

        total_questions = (
            question["total_questions"]
        )

        # -------------------------------------------------
        # Update interview current question
        # -------------------------------------------------

        if next_question <= total_questions:

            update_interview_query = """
                UPDATE interviews
                SET current_question = %s
                WHERE id = %s
                  AND candidate_id = %s
            """

            cursor.execute(
                update_interview_query,
                (
                    next_question,
                    question["interview_id"],
                    user_id
                )
            )

        else:

            # All questions have been answered.
            # Keep current_question at total_questions + 1.

            update_interview_query = """
                UPDATE interviews
                SET current_question = %s
                WHERE id = %s
                  AND candidate_id = %s
            """

            cursor.execute(
                update_interview_query,
                (
                    total_questions + 1,
                    question["interview_id"],
                    user_id
                )
            )

        # -------------------------------------------------
        # Commit everything
        # -------------------------------------------------

        connection.commit()

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "Answer submitted successfully.",

            "question_id":
                question_id,

            "question_number":
                question["question_number"],

            # Final AI score
            "score":
                score,

            # AI feedback
            "feedback":
                feedback,

            "strengths":
                evaluation["strengths"],

            "improvements":
                evaluation["improvements"],

            # AI score breakdown
            "semantic_score":
                float(
                    evaluation["semantic_score"]
                ),

            "keyword_score":
                float(
                    evaluation["keyword_score"]
                ),

            "completeness_score":
                float(
                    evaluation["completeness_score"]
                ),

            # Interview progress
            "next_question":
                next_question
                if next_question <= total_questions
                else None,

            "total_questions":
                total_questions

        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print(
            "Submit interview answer error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Failed to submit answer.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# COMPLETE INTERVIEW
# =========================================================

@interview_bp.route(
    "/<int:interview_id>/complete",
    methods=["POST"]
)
@token_required
@role_required("Candidate")
def complete_interview(interview_id):

    connection = None
    cursor = None

    try:

        user_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get interview
        # -------------------------------------------------

        query = """
            SELECT
                id,
                candidate_id,
                job_role,
                difficulty,
                total_questions,
                current_question,
                total_score,
                status,
                started_at,
                completed_at
            FROM interviews
            WHERE id = %s
              AND candidate_id = %s
        """

        cursor.execute(query, (interview_id, user_id))

        interview = cursor.fetchone()

        if not interview:
            return jsonify({
                "success": False,
                "message": "Interview not found."
            }), 404

        # -------------------------------------------------
        # Check if already completed
        # -------------------------------------------------

        if interview["status"] == "Completed":

            return jsonify({
                "success": False,
                "message": "Interview has already been completed."
            }), 400

        # -------------------------------------------------
        # Get question scores
        # -------------------------------------------------

        query = """
            SELECT
                id,
                question_number,
                score,
                candidate_answer
            FROM interview_questions
            WHERE interview_id = %s
            ORDER BY question_number ASC
        """

        cursor.execute(query, (interview_id,))

        questions = cursor.fetchall()

        # -------------------------------------------------
        # Check number of questions
        # -------------------------------------------------

        if len(questions) < interview["total_questions"]:

            return jsonify({
                "success": False,
                "message": "All interview questions have not been answered.",
                "answered_questions": len(questions),
                "total_questions": interview["total_questions"]
            }), 400

        # -------------------------------------------------
        # Check unanswered questions
        # -------------------------------------------------

        unanswered_questions = []

        for question in questions:

            if question["candidate_answer"] is None:
                unanswered_questions.append(
                    question["question_number"]
                )

        if unanswered_questions:

            return jsonify({
                "success": False,
                "message": "Some questions have not been answered.",
                "unanswered_questions": unanswered_questions
            }), 400

        # -------------------------------------------------
        # Calculate final score
        # -------------------------------------------------

        total_score = 0

        for question in questions:

            score = question["score"]

            if score is not None:
                total_score += float(score)

        final_score = total_score / len(questions)

        # Round to 2 decimal places
        final_score = round(final_score, 2)

        # -------------------------------------------------
        # Update interview
        # -------------------------------------------------

        update_query = """
            UPDATE interviews
            SET
                total_score = %s,
                status = 'Completed',
                completed_at = NOW()
            WHERE id = %s
        """

        cursor.execute(
            update_query,
            (
                final_score,
                interview_id
            )
        )

        connection.commit()

        # -------------------------------------------------
        # Performance label
        # -------------------------------------------------

        if final_score >= 85:
            performance = "Excellent Performance"

        elif final_score >= 70:
            performance = "Very Good Performance"

        elif final_score >= 50:
            performance = "Average Performance"

        else:
            performance = "Needs Improvement"

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({
            "success": True,
            "message": "Interview completed successfully.",
            "interview_id": interview_id,
            "job_role": interview["job_role"],
            "difficulty": interview["difficulty"],
            "total_questions": interview["total_questions"],
            "final_score": final_score,
            "performance": performance,
            "status": "Completed"
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("Complete interview error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to complete interview.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# INTERVIEW EVALUATION
# =========================================================

@interview_bp.route(
    "/<int:interview_id>/evaluation",
    methods=["GET"]
)
@token_required
@role_required("Candidate")
def interview_evaluation(interview_id):

    connection = None
    cursor = None

    try:

        user_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get interview
        # -------------------------------------------------

        query = """
            SELECT
                id,
                candidate_id,
                job_role,
                difficulty,
                total_questions,
                total_score,
                status,
                started_at,
                completed_at
            FROM interviews
            WHERE id = %s
              AND candidate_id = %s
        """

        cursor.execute(query, (interview_id, user_id))

        interview = cursor.fetchone()

        if not interview:
            return jsonify({
                "success": False,
                "message": "Interview not found."
            }), 404

        # -------------------------------------------------
        # Check completion
        # -------------------------------------------------

        if interview["status"] != "Completed":
            return jsonify({
                "success": False,
                "message": "Interview has not been completed yet."
            }), 400

        # -------------------------------------------------
        # Get questions and answers
        # -------------------------------------------------

        query = """
            SELECT
                id,
                question_number,
                question_text,
                candidate_answer,
                score,
                feedback,
                correct_answer
            FROM interview_questions
            WHERE interview_id = %s
            ORDER BY question_number ASC
        """

        cursor.execute(query, (interview_id,))

        questions = cursor.fetchall()

        # -------------------------------------------------
        # Calculate strengths and improvements
        # -------------------------------------------------

        strengths = []
        improvements = []

        scores = []

        for question in questions:

            score = question["score"]

            if score is not None:

                scores.append(float(score))

                if float(score) >= 85:

                    strengths.append(
                        f"Strong response to Question "
                        f"{question['question_number']}"
                    )

                elif float(score) >= 70:

                    strengths.append(
                        f"Good response to Question "
                        f"{question['question_number']}"
                    )

                else:

                    improvements.append(
                        f"Improve your response to Question "
                        f"{question['question_number']}"
                    )

        # -------------------------------------------------
        # Default improvement suggestions
        # -------------------------------------------------

        if not improvements:

            improvements = [
                "Provide more real-world examples",
                "Explain technical concepts more confidently",
                "Continue practicing technical interview questions"
            ]

        if not strengths:

            strengths = [
                "Candidate completed the interview",
                "Candidate attempted all questions"
            ]

        # -------------------------------------------------
        # Performance label
        # -------------------------------------------------

        final_score = float(
            interview["total_score"] or 0
        )

        if final_score >= 85:

            performance = "Excellent Performance"

        elif final_score >= 70:

            performance = "Very Good Performance"

        elif final_score >= 50:

            performance = "Average Performance"

        else:

            performance = "Needs Improvement"

        # -------------------------------------------------
        # Prepare question results
        # -------------------------------------------------

        question_results = []

        for question in questions:

            question_results.append({

                "question_number":
                    question["question_number"],

                "question_text":
                    question["question_text"],

                "candidate_answer":
                    question["candidate_answer"],

                "score":
                    float(question["score"])
                    if question["score"] is not None
                    else 0,

                "feedback":
                    question["feedback"],

                "correct_answer":
                    question["correct_answer"]

            })

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "interview": {
                "id": interview["id"],
                "job_role": interview["job_role"],
                "difficulty": interview["difficulty"],
                "total_questions": interview["total_questions"],
                "final_score": final_score,
                "performance": performance,
                "status": interview["status"],
                "started_at": interview["started_at"],
                "completed_at": interview["completed_at"]
            },

            "evaluation": {
                "strengths": strengths,
                "improvements": improvements
            },

            "questions": question_results

        }), 200

    except Exception as e:

        print("Interview evaluation error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to fetch interview evaluation.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# INTERVIEW HISTORY
# =========================================================

@interview_bp.route(
    "/history",
    methods=["GET"]
)
@token_required
@role_required("Candidate")
def interview_history():

    connection = None
    cursor = None

    try:

        user_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                job_role,
                difficulty,
                total_questions,
                total_score,
                status,
                started_at,
                completed_at
            FROM interviews
            WHERE candidate_id = %s
            ORDER BY started_at DESC
        """

        cursor.execute(query, (user_id,))

        history = cursor.fetchall()

        # -------------------------------------------------
        # Format history data
        # -------------------------------------------------

        formatted_history = []

        for interview in history:

            score = (
                float(interview["total_score"])
                if interview["total_score"] is not None
                else 0
            )

            formatted_history.append({

                "interview_id":
                    interview["id"],

                "job_role":
                    interview["job_role"],

                "difficulty":
                    interview["difficulty"],

                "total_questions":
                    interview["total_questions"],

                "score":
                    score,

                "status":
                    interview["status"],

                "started_at":
                    interview["started_at"],

                "completed_at":
                    interview["completed_at"]

            })

        return jsonify({
            "success": True,
            "history": formatted_history
        }), 200

    except Exception as e:

        print("Interview history error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to fetch interview history.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()