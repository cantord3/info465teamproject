// registration.js - Course Registration System
class RegistrationSystem {
    constructor() {
        this.enrolledCourses = [];
        this.availableCourses = [];
        this.studentId = 'S123456';
        this.maxCredits = 18;
        this.init();
    }

    init() {
        this.loadEnrolledCourses();
        this.loadAvailableCourses();
        this.setupEventListeners();
    }

    // Load enrolled courses from localStorage or initialize
    loadEnrolledCourses() {
        const saved = localStorage.getItem(`enrolled_${this.studentId}`);
        this.enrolledCourses = saved ? JSON.parse(saved) : [];
        this.updateEnrolledDisplay();
    }

    // Load available courses (mock data)
    loadAvailableCourses() {
        // Mock course data
        this.availableCourses = [
            {
                id: 'CS101',
                code: 'CS101',
                name: 'Introduction to Programming',
                instructor: 'Dr. Smith',
                schedule: 'MWF 10:00-10:50',
                credits: 3,
                maxCapacity: 30,
                currentEnrollment: 25,
                department: 'Computer Science'
            },
            {
                id: 'MATH202',
                code: 'MATH202',
                name: 'Calculus II',
                instructor: 'Prof. Johnson',
                schedule: 'TTH 11:00-12:15',
                credits: 4,
                maxCapacity: 25,
                currentEnrollment: 18,
                department: 'Mathematics'
            },
            {
                id: 'ENG150',
                code: 'ENG150',
                name: 'Composition I',
                instructor: 'Dr. Williams',
                schedule: 'MW 13:00-14:15',
                credits: 3,
                maxCapacity: 30,
                currentEnrollment: 30,
                department: 'English'
            },
            {
                id: 'PHY210',
                code: 'PHY210',
                name: 'Modern Physics',
                instructor: 'Prof. Davis',
                schedule: 'TTH 14:00-15:15',
                credits: 4,
                maxCapacity: 20,
                currentEnrollment: 12,
                department: 'Physics'
            },
            {
                id: 'BIO105',
                code: 'BIO105',
                name: 'Cell Biology',
                instructor: 'Dr. Wilson',
                schedule: 'MWF 09:00-09:50',
                credits: 3,
                maxCapacity: 25,
                currentEnrollment: 20,
                department: 'Biology'
            }
        ];
        this.updateAvailableDisplay();
    }

    // Setup event listeners
    setupEventListeners() {
        // Event delegation for register buttons
        document.getElementById('availableCourses').addEventListener('click', (e) => {
            if (e.target.classList.contains('register-btn')) {
                const courseId = e.target.dataset.courseId;
                this.registerForCourse(courseId);
            }
        });

        // Event delegation for drop buttons
        document.getElementById('enrolledCoursesList').addEventListener('click', (e) => {
            if (e.target.classList.contains('drop-btn')) {
                const courseId = e.target.dataset.courseId;
                this.dropCourse(courseId);
            }
        });
    }

    // Register for a course
    async registerForCourse(courseId) {
        const course = this.availableCourses.find(c => c.id === courseId);
        
        if (!course) {
            this.showError('Course not found.');
            return;
        }

        // Validate registration
        const validation = this.validateRegistration(course);
        
        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        try {
            // Simulate API call
            await this.simulateRegistrationAPI(course);
            
            // Add to enrolled courses
            this.enrolledCourses.push({
                ...course,
                enrollmentDate: new Date().toISOString()
            });
            
            // Update course enrollment count
            course.currentEnrollment++;
            
            // Save to localStorage
            this.saveEnrolledCourses();
            
            // Update displays
            this.updateEnrolledDisplay();
            this.updateAvailableDisplay();
            
            this.showSuccess(`Successfully registered for ${course.code} - ${course.name}`);
            
        } catch (error) {
            this.showError('Registration failed. Please try again.');
        }
    }

    // Drop a course
    async dropCourse(courseId) {
        const courseIndex = this.enrolledCourses.findIndex(c => c.id === courseId);
        
        if (courseIndex === -1) {
            this.showError('Course not found in your schedule.');
            return;
        }

        const course = this.enrolledCourses[courseIndex];

        try {
            // Simulate API call
            await this.simulateDropAPI(course);
            
            // Remove from enrolled courses
            this.enrolledCourses.splice(courseIndex, 1);
            
            // Update course enrollment count
            const availableCourse = this.availableCourses.find(c => c.id === courseId);
            if (availableCourse) {
                availableCourse.currentEnrollment--;
            }
            
            // Save to localStorage
            this.saveEnrolledCourses();
            
            // Update displays
            this.updateEnrolledDisplay();
            this.updateAvailableDisplay();
            
            this.showSuccess(`Successfully dropped ${course.code} - ${course.name}`);
            
        } catch (error) {
            this.showError('Failed to drop course. Please try again.');
        }
    }

    // Validate registration
    validateRegistration(course) {
        // Check if already enrolled
        if (this.enrolledCourses.find(c => c.id === course.id)) {
            return { valid: false, message: 'You are already enrolled in this course.' };
        }

        // Check capacity
        if (course.currentEnrollment >= course.maxCapacity) {
            return { valid: false, message: 'This course is full.' };
        }

        // Check credit limit
        const currentCredits = this.enrolledCourses.reduce((sum, c) => sum + c.credits, 0);
        if (currentCredits + course.credits > this.maxCredits) {
            return { valid: false, message: `This would exceed your maximum credit limit of ${this.maxCredits}.` };
        }

        // Check schedule conflicts
        const conflict = this.checkScheduleConflict(course);
        if (conflict) {
            return { valid: false, message: `Schedule conflict with ${conflict.code} - ${conflict.name}` };
        }

        return { valid: true, message: 'Registration valid.' };
    }

    // Check for schedule conflicts
    checkScheduleConflict(newCourse) {
        return this.enrolledCourses.find(enrolled => {
            return this.hasTimeOverlap(enrolled.schedule, newCourse.schedule);
        });
    }

    // Simple time overlap detection
    hasTimeOverlap(schedule1, schedule2) {
        // This is a simplified version - in real implementation, you'd parse dates properly
        const times1 = this.extractTimes(schedule1);
        const times2 = this.extractTimes(schedule2);
        
        if (!times1 || !times2) return false;
        
        // Check if days overlap (simplified)
        const days1 = schedule1.match(/[A-Z]/g) || [];
        const days2 = schedule2.match(/[A-Z]/g) || [];
        const commonDays = days1.filter(day => days2.includes(day));
        
        if (commonDays.length === 0) return false;
        
        // Check time overlap
        return this.timeRangesOverlap(times1, times2);
    }

    extractTimes(schedule) {
        const timeMatch = schedule.match(/(\d+:\d+)-(\d+:\d+)/);
        if (!timeMatch) return null;
        
        return {
            start: this.timeToMinutes(timeMatch[1]),
            end: this.timeToMinutes(timeMatch[2])
        };
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    timeRangesOverlap(range1, range2) {
        return range1.start < range2.end && range2.start < range1.end;
    }

    // Update enrolled courses display
    updateEnrolledDisplay() {
        const container = document.getElementById('enrolledCoursesList');
        const loading = document.getElementById('enrolledLoading');
        const totalCreditsElem = document.getElementById('totalCredits');
        const enrolledCountElem = document.getElementById('enrolledCourses');
        
        if (this.enrolledCourses.length === 0) {
            container.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No courses enrolled</td></tr>';
            totalCreditsElem.textContent = '0';
            enrolledCountElem.textContent = '0';
            loading.style.display = 'none';
            return;
        }

        const totalCredits = this.enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
        
        container.innerHTML = this.enrolledCourses.map(course => `
            <tr>
                <td>
                    <strong>${course.code}</strong><br>
                    <small>${course.name}</small>
                </td>
                <td>${course.schedule}</td>
                <td>${course.credits}</td>
                <td>
                    <button class="btn btn-danger drop-btn" data-course-id="${course.id}">
                        Drop
                    </button>
                </td>
            </tr>
        `).join('');

        totalCreditsElem.textContent = totalCredits;
        enrolledCountElem.textContent = this.enrolledCourses.length;
        loading.style.display = 'none';
    }

    // Update available courses display
    updateAvailableDisplay() {
        const container = document.getElementById('availableCourses');
        const loading = document.getElementById('availableLoading');
        
        container.innerHTML = this.availableCourses.map(course => {
            const isFull = course.currentEnrollment >= course.maxCapacity;
            const isEnrolled = this.enrolledCourses.find(c => c.id === course.id);
            const availableSpots = course.maxCapacity - course.currentEnrollment;
            
            return `
                <div class="course-item">
                    <div class="course-info">
                        <h4>${course.code} - ${course.name}</h4>
                        <div class="course-meta">
                            ${course.instructor} • ${course.schedule} • ${course.credits} credits
                            <br>
                            <span class="enrollment-status ${isFull ? 'status-full' : 'status-open'}">
                                ${isFull ? 'Full' : `${availableSpots} spots available`}
                            </span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-primary register-btn" 
                                data-course-id="${course.id}"
                                ${isFull || isEnrolled ? 'disabled' : ''}>
                            ${isEnrolled ? 'Enrolled' : (isFull ? 'Full' : 'Register')}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        loading.style.display = 'none';
    }

    
    saveEnrolledCourses() {
        localStorage.setItem(`enrolled_${this.studentId}`, JSON.stringify(this.enrolledCourses));
    }

    
    showSuccess(message) {
        const alert = document.getElementById('successAlert');
        const messageElem = document.getElementById('successMessage');
        
        messageElem.textContent = message;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }

    
    showError(message) {
        const alert = document.getElementById('errorAlert');
        const messageElem = document.getElementById('errorMessage');
        
        messageElem.textContent = message;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }

    
    simulateRegistrationAPI(course) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failures (10% chance)
                if (Math.random() < 0.1) {
                    reject(new Error('API Error'));
                } else {
                    resolve({ success: true, course });
                }
            }, 1000);
        });
    }

    simulateDropAPI(course) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failures (5% chance)
                if (Math.random() < 0.05) {
                    reject(new Error('API Error'));
                } else {
                    resolve({ success: true, course });
                }
            }, 800);
        });
    }

    
    static initDashboard() {
        window.registrationSystem = new RegistrationSystem();
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', RegistrationSystem.initDashboard);
} else {
    RegistrationSystem.initDashboard();
}