function newStudent() {
    localStorage.removeItem('editStudentId');
    window.location.href = 'add_or_update-student.html';
}
// Load the student table
function loadTable() {
    fetch('http://localhost:8080/student/get-student')
        .then(response => response.json())
        .then(students => {
            const tableBody = document.querySelector('#tblStudent tbody');
            tableBody.innerHTML = '';
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.studentName}</td>
                    <td>${student.studentAge}</td>
                    <td>${student.studentContactNumber}</td>
                    <td>${student.guardianAddress}</td>
                    <td><img src="data:image/jpeg;base64,${student.studentImage}" class="img-thumbnail" style="max-width: 100px;"></td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="viewStudentDetails(${student.studentId})"> commit
                        <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="editStudent(${student.studentId})">
                        <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.studentId})">
                        <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// View student details
function viewStudentDetails(studentId) {
    window.location.href = `student-details.html?id=${studentId}`;
}

// Edit a student
function editStudent(studentId) {
    localStorage.setItem('editStudentId', studentId);
    window.location.href = 'add_or_update-student.html';
}

// Delete a student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`http://localhost:8080/student/delete-by-id/${studentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete student: ' + response.statusText);
            }
            loadTable();
        })
        .catch(error => console.error('Error:', error));
    }
}
