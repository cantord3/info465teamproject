INFO 465 Team Project – Online Course Registration System
=========================================================

Team Members & Contributions
----------------------------
- Darren: Created the initial Home Page and base CSS stylesheet for shared styling and layout consistency.
- Adam: Extended the project setup from Darren’s base files and organized repository structure.
- Joshua: Built out the remaining screens (Student Registration, Course Search, Instructor Schedule, and Session Enrollment), added JavaScript interactivity, and ensured design consistency across all pages.

Screen Summaries
----------------
1. Home Screen (home.html / index.html)
   - Provides navigation to core system functionalities: Course Search, Student Registration, Instructor Schedules, and Session Enrollment.
   - Elements used: navigation bar, grid layout, styled headings.

2. Course Search Screen (course-search.html)
   - Allows searching for courses by department, instructor, or course number.
   - Displays course details such as credit hours, prerequisites, modality, and maximum enrollment.
   - Elements used: form inputs, select dropdown, table for results, CSS grid.

3. Student Registration Screen (student-registration.html)
   - Students can register with name, student ID, email, and password.
   - Includes validation for required fields and a mock alert on submission.
   - Elements used: form inputs, labels, buttons, JavaScript event handling.

4. Instructor Schedule Screen (instructor-schedule.html)
   - Instructors can log in to view their assigned sessions.
   - Displays a simple schedule table after login.
   - Elements used: login form, table, CSS layout.

5. Session Enrollment Screen (session-enrollment.html)
   - Authorized users can view a list of students enrolled in a particular session.
   - Elements used: table, styled rows and columns for clarity.

Design Consistency
------------------
- A shared CSS stylesheet (`styles.css`) ensures a uniform look and feel across all screens.
- Common elements: navigation bar, button styles, typography, color scheme (#004080 as the primary color).
- Consistent layout principles: centered containers, card-style forms, and responsive grid layouts.

Design Challenges & Decisions
-----------------------------
- Ensuring navigation and styling were consistent across all screens required consolidating inline CSS into a single shared stylesheet.
- Balancing simplicity with functionality: since backend logic was not required, forms and tables were designed as prototypes with JavaScript alerts for interactivity.
- Adjusting layouts for usability and readability across different screen sizes.

Repository Information
----------------------
- GitHub Repository: https://github.com/cantord3/info465teamproject
- All team members have been added as collaborators with read/write access.
- Each `.html` file is accessible via the browser, with screenshots provided as proof of functionality.
