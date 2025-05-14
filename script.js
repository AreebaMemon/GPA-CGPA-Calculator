
const gradePoints = {
    'A+': 4.00,
    'A': 3.50,
    'B+': 3.00,
    'B': 2.50,
    'C+': 2.00,
    'C': 1.00,
    'F': 0.00
};

let semesterCount = 1;
const MAX_SEMESTERS = 8;

function createGenericSubjects() {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';
    
    const numSubjects = 5; 
    for (let i = 1; i <= numSubjects; i++) {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject-input';
        subjectDiv.innerHTML = `
            <h3>Subject ${i}</h3>
            <select class="credit-hours" required>
                <option value="">Select Credit Hours</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <select class="grade" required>
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="F">F</option>
            </select>
        `;
        container.appendChild(subjectDiv);
    }
}

function addSubject(semesterId) {
   const subjectsList = document.querySelector(`#semester-${semesterId} .subjects-list`);
const subjectCount = subjectsList.children.length + 1;

const subjectEntry = document.createElement('div');
subjectEntry.className = 'subject-entry';
subjectEntry.innerHTML = `
    <button class="btn-remove" onclick="removeSubject(this)">✕</button>
    <input type="text" placeholder="Subject Name" required>
    <select class="credit-hours" required>
        <option value="">Credits</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
    <select class="grade" required>
        <option value="">Grade</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="F">F</option>
    </select>
`;

subjectsList.appendChild(subjectEntry);
}


function removeSubject(button) {
    button.parentElement.remove();}

function addSemester() {
    if (semesterCount >= MAX_SEMESTERS) {
        alert(`Maximum ${MAX_SEMESTERS} semesters are allowed`);
        return;
    }
    
    semesterCount++;
    const semestersContainer = document.querySelector('.semesters-container');
    
    const semesterCard = document.createElement('div');
    semesterCard.className = 'semester-card';
    semesterCard.id = `semester-${semesterCount}`;
    semesterCard.innerHTML = `
        <div class="semester-header">
            <h2>Semester ${semesterCount}</h2>
            <div class="semester-actions">
                <button class="btn-add-subject" onclick="addSubject(${semesterCount})">+ Add Subject</button>
                <button class="btn-remove" onclick="removeSemester(${semesterCount})">✕</button>
            </div>
        </div>
        <div class="subjects-list">
            <!-- Subjects will be added here -->
        </div>
        <div class="semester-footer">
            <button class="btn-calculate" onclick="calculateSemesterGPA(${semesterCount})">Calculate GPA</button>
            <div class="semester-gpa">GPA: --</div>
        </div>
    `;
    
    semestersContainer.appendChild(semesterCard);
    addSubject(semesterCount); 
    
    updateAddSemesterButtonStatus();
}

function updateAddSemesterButtonStatus() {
    const addSemesterBtn = document.querySelector('.controls button:first-child');
    if (semesterCount >= MAX_SEMESTERS) {
        addSemesterBtn.disabled = true;
        addSemesterBtn.style.opacity = "0.5";
        addSemesterBtn.style.cursor = "not-allowed";
    } else {
        addSemesterBtn.disabled = false;
        addSemesterBtn.style.opacity = "1";
        addSemesterBtn.style.cursor = "pointer";
    }
}

function removeSemester(semesterId) {
    if (semesterCount === 1) {
        alert('Cannot remove the last semester');
        return;
    }
    
    const semesterToRemove = document.getElementById(`semester-${semesterId}`);
    semesterToRemove.remove();
    
    const semesters = document.querySelectorAll('.semester-card');
    semesters.forEach((semester, index) => {
        const newId = index + 1;
        semester.id = `semester-${newId}`;
        semester.querySelector('h2').textContent = `Semester ${newId}`;
        
        const addSubjectBtn = semester.querySelector('.btn-add-subject');
        const removeSemesterBtn = semester.querySelector('.btn-remove');
        const calculateBtn = semester.querySelector('.btn-calculate');
        
        addSubjectBtn.setAttribute('onclick', `addSubject(${newId})`);
        removeSemesterBtn.setAttribute('onclick', `removeSemester(${newId})`);
        calculateBtn.setAttribute('onclick', `calculateSemesterGPA(${newId})`);
    });
    
    semesterCount--;

    updateAddSemesterButtonStatus();
}

function calculateSemesterGPA(semesterId) {
    const semester = document.getElementById(`semester-${semesterId}`);
    const subjects = semester.querySelectorAll('.subject-entry');
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (let subject of subjects) {
        const creditHours = parseFloat(subject.querySelector('.credit-hours').value);
        const grade = subject.querySelector('.grade').value;
        
        if (!creditHours || !grade) {
            alert('Please fill in all subject details');
            return;
        }
        
        totalPoints += creditHours * gradePoints[grade];
        totalCredits += creditHours;
    }
    
    if (totalCredits > 0) {
        const gpa = totalPoints / totalCredits;
        semester.querySelector('.semester-gpa').textContent = `GPA: ${gpa.toFixed(2)}`;
    }
}

function calculateCGPA() {
    const semesters = document.querySelectorAll('.semester-card');
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (let semester of semesters) {
        const subjects = semester.querySelectorAll('.subject-entry');
        
        for (let subject of subjects) {
            const creditHours = parseFloat(subject.querySelector('.credit-hours').value);
            const grade = subject.querySelector('.grade').value;
            
            if (!creditHours || !grade) {
                alert('Please fill in all subject details in all semesters');
                return;
            }
            
            totalPoints += creditHours * gradePoints[grade];
            totalCredits += creditHours;
        }
    }
    
    if (totalCredits > 0) {
        const cgpa = totalPoints / totalCredits;
        document.querySelector('.cgpa-value').textContent = cgpa.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addSubject(1);
    updateAddSemesterButtonStatus();
});

function resetCalculator() {
    if (!confirm('Are you sure you want to reset all calculations?')) {
        return;
    }
    
    semesterCount = 1;
    
    const semestersContainer = document.querySelector('.semesters-container');
    semestersContainer.innerHTML = '';
    
    const firstSemester = document.createElement('div');
    firstSemester.className = 'semester-card';
    firstSemester.id = 'semester-1';
    firstSemester.innerHTML = `
        <div class="semester-header">
            <h2>Semester 1</h2>
            <div class="semester-actions">
                <button class="btn-add-subject" onclick="addSubject(1)">+ Add Subject</button>
            </div>
        </div>
        <div class="subjects-list">
        </div>
        <div class="semester-footer">
            <button class="btn-calculate" onclick="calculateSemesterGPA(1)">Calculate GPA</button>
            <div class="semester-gpa">GPA: --</div>
        </div>
    `;
    
    semestersContainer.appendChild(firstSemester);
    
    document.querySelector('.cgpa-value').textContent = '--';
    
    addSubject(1);
    updateAddSemesterButtonStatus();
}

