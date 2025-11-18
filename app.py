import streamlit as st
import sqlite3
import bcrypt

# --- Database Setup ---
conn = sqlite3.connect("courses.db")
c = conn.cursor()

# Create tables if not exist
c.execute('''CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password TEXT)''')

c.execute('''CREATE TABLE IF NOT EXISTS courses (
                course_id TEXT PRIMARY KEY,
                name TEXT,
                seats INTEGER,
                active INTEGER)''')  # active = 1 (open), 0 (inactive)

c.execute('''CREATE TABLE IF NOT EXISTS registrations (
                username TEXT,
                course_id TEXT,
                PRIMARY KEY(username, course_id))''')

c.execute('''CREATE TABLE IF NOT EXISTS prerequisites (
                course_id TEXT,
                prereq_id TEXT,
                PRIMARY KEY(course_id, prereq_id))''')
conn.commit()

# --- Seed Courses (only if empty) ---
existing_courses = c.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
if existing_courses == 0:
    courses = [
        ("CS101", "Intro to Computer Science", 30, 1),
        ("CS201", "Data Structures", 25, 1),
        ("MATH201", "Calculus I", 25, 1),
        ("ENG150", "English Literature", 20, 1),
        ("IS310", "Information Systems Fundamentals", 40, 1),
        ("HIST210", "World History", 35, 1),
    ]
    c.executemany("INSERT INTO courses VALUES (?, ?, ?, ?)", courses)

    # Add prerequisites (CS201 requires CS101)
    c.execute("INSERT INTO prerequisites VALUES (?, ?)", ("CS201", "CS101"))

    conn.commit()

# --- Helper Functions ---
def register_user(username, password):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    try:
        c.execute("INSERT INTO users VALUES (?, ?)", (username, hashed))
        conn.commit()
        return True
    except:
        return False

def login_user(username, password):
    c.execute("SELECT password FROM users WHERE username=?", (username,))
    result = c.fetchone()
    if result and bcrypt.checkpw(password.encode(), result[0]):
        return True
    return False

def search_courses(query):
    if query:
        return c.execute(
            "SELECT * FROM courses WHERE active=1 AND (name LIKE ? OR course_id LIKE ?)",
            (f"%{query}%", f"%{query}%")
        ).fetchall()
    else:
        return c.execute("SELECT * FROM courses WHERE active=1").fetchall()

def check_prerequisites(username, course_id):
    prereqs = c.execute("SELECT prereq_id FROM prerequisites WHERE course_id=?", (course_id,)).fetchall()
    prereqs = [p[0] for p in prereqs]
    if not prereqs:
        return True
    registered = c.execute("SELECT course_id FROM registrations WHERE username=?", (username,)).fetchall()
    registered = [r[0] for r in registered]
    return all(p in registered for p in prereqs)

def register_course(username, course_id):
    c.execute("SELECT seats FROM courses WHERE course_id=? AND active=1", (course_id,))
    result = c.fetchone()
    if not result:
        return "Course not active."
    seats = result[0]
    if seats <= 0:
        return "No seats available."
    if not check_prerequisites(username, course_id):
        return "Prerequisites not met."
    try:
        c.execute("INSERT INTO registrations VALUES (?, ?)", (username, course_id))
        c.execute("UPDATE courses SET seats = seats - 1 WHERE course_id=?", (course_id,))
        conn.commit()
        return "Success"
    except:
        return "Already registered."

# --- Streamlit UI ---
st.title("📚 Course Registration System")

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    choice = st.radio("Login or Register", ["Login", "Register"])
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if choice == "Register":
        if st.button("Register"):
            if register_user(username, password):
                st.success("User registered successfully!")
            else:
                st.error("Username already exists.")
    else:
        if st.button("Login"):
            if login_user(username, password):
                st.session_state.logged_in = True
                st.session_state.username = username
                st.success("Logged in successfully!")
            else:
                st.error("Invalid credentials.")
else:
    st.subheader(f"Welcome {st.session_state.username}!")
    query = st.text_input("🔍 Search courses by name or code")
    courses = search_courses(query)

    if not courses:
        st.warning("No active courses found.")
    else:
        for course_id, name, seats, active in courses:
            st.write(f"{name} ({course_id}) - Seats left: {seats}")
            if st.button(f"Register for {name}", key=course_id):
                result = register_course(st.session_state.username, course_id)
                if result == "Success":
                    st.success(f"Registered for {name}!")
                else:
                    st.error(result)