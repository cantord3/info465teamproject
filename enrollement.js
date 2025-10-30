// Real-time capacity checking
function checkCourseCapacity(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    return course.currentEnrollment < course.maxCapacity;
}

// Schedule conflict detection
function detectScheduleConflicts(newCourse, enrolledCourses) {
    return enrolledCourses.some(enrolled => 
        hasTimeOverlap(enrolled.schedule, newCourse.schedule)
    );
}