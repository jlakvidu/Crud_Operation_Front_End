//Navugate New Student Page
function newStudent() {
    localStorage.removeItem('editStudentId');
    window.location.href = 'add-student.html';
}

//load the student table
function loadTable() {
    fetch('http://localhost:8080/student/get-student')
        .then(response => response.json())
        .then(students => {
            const tableBody = document.querySelector('#tblStudent tbody');
            tableBody.innerHTML = '';
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.studentId}</td>
                    <td>${student.studentName}</td>
                    <td>${student.studentAge}</td>
                    <td>${student.studentContactNumber}</td>
                    <td>${student.guardianAddress}</td>
                    <td><img src="data:image/jpeg;base64,${student.studentImage}" class="img-thumbnail" style="max-width: 100px;"></td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editStudent(${student.studentId})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.studentId})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

//edit a student
function editStudent(studentId) {
    localStorage.setItem('editStudentId', studentId);
    window.location.href = 'add-student.html';
}

//delete a student
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

