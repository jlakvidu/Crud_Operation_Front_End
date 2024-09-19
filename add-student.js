function clearForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('imagePreview').src = '';
    const formTitle = document.getElementById('formTitle');
    const submitButton = document.getElementById('submitButton');
    formTitle.textContent = "Add Student";
    submitButton.textContent = "Add Student";
    submitButton.onclick = addStudentWithImage;
    localStorage.removeItem('editStudentId');
}

//selected image
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('imagePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

//add a new student
function addStudentWithImage() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    const studentName = document.getElementById("txtStdName").value;
    const studentAge = document.getElementById("txtStdAge").value;
    const studentContact = document.getElementById("txtStdContact").value;
    const guardianName = document.getElementById("txtGuardianName").value;
    const guardianAddress = document.getElementById("txtGuardianAddress").value;
    const guardianContact = document.getElementById("txtGuardianContact").value;

    const form = document.getElementById('studentForm');
    if (!form.checkValidity()) {
        alert("Please fill out all required fields.");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];

            const student = {
                "studentName": studentName,
                "studentAge": studentAge,
                "studentContactNumber": studentContact,
                "guardianName": guardianName,
                "guardianAddress": guardianAddress,
                "guardianContactNumber": guardianContact,
                "studentImage": base64Image
            };

            fetch("http://localhost:8080/student/add-student-with-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add student: ' + response.statusText);
                    }
                    return response.text();
                })
                .then(result => {
                    alert("Student added successfully!");
                    clearForm();
                    window.location.href = 'index.html';
                })
                .catch(error => console.error('Error:', error));
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image for the student.");
    }
}

//update student
function updateStudent() {
    const studentId = localStorage.getItem('editStudentId');
    if (!studentId) {
        alert("No student ID found for update.");
        return;
    }

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    const studentName = document.getElementById("txtStdName").value;
    const studentAge = document.getElementById("txtStdAge").value;
    const studentContact = document.getElementById("txtStdContact").value;
    const guardianName = document.getElementById("txtGuardianName").value;
    const guardianAddress = document.getElementById("txtGuardianAddress").value;
    const guardianContact = document.getElementById("txtGuardianContact").value;

    let base64Image = document.getElementById('imagePreview').src.split(',')[1];

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            base64Image = reader.result.split(',')[1];
            sendUpdateRequest(studentId, studentName, studentAge, studentContact, guardianName, guardianAddress, guardianContact, base64Image);
        };
        reader.readAsDataURL(file);
    } else {
        sendUpdateRequest(studentId, studentName, studentAge, studentContact, guardianName, guardianAddress, guardianContact, base64Image);
    }
}

function sendUpdateRequest(studentId, studentName, studentAge, studentContact, guardianName, guardianAddress, guardianContact, imageBase64) {

    console.log('Sending update request with data:', {
        studentId, studentName, studentAge, studentContact, guardianName, guardianAddress, guardianContact, imageBase64
    });

    const student = {
        "studentId": studentId,
        "studentName": studentName,
        "studentAge": studentAge,
        "studentContactNumber": studentContact,
        "guardianName": guardianName,
        "guardianAddress": guardianAddress,
        "guardianContactNumber": guardianContact,
        "studentImage": imageBase64
    };

    fetch("http://localhost:8080/student/update-student", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error('Failed to update student: ' + errorText);
                });
            }
            return response.text();
        })
        .then(result => {
            alert("Student updated successfully!");
            clearForm();
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Error:', error));
}


window.onload = () => {
    const studentId = localStorage.getItem('editStudentId');
    if (studentId) {
        const formTitle = document.getElementById('formTitle');
        const submitButton = document.getElementById('submitButton');
        formTitle.textContent = "Update Student";
        submitButton.textContent = "Update Student";
        submitButton.onclick = updateStudent;

        fetch(`http://localhost:8080/student/find-by-id/${studentId}`)
            .then(response => response.json())
            .then(student => {
                document.getElementById('txtStdName').value = student.studentName;
                document.getElementById('txtStdAge').value = student.studentAge;
                document.getElementById('txtStdContact').value = student.studentContactNumber;
                document.getElementById('txtGuardianName').value = student.guardianName;
                document.getElementById('txtGuardianAddress').value = student.guardianAddress;
                document.getElementById('txtGuardianContact').value = student.guardianContactNumber;
                if (student.studentImage) {
                    document.getElementById('imagePreview').src = `data:image/jpeg;base64,${student.studentImage}`;
                }
            })
            .catch(error => console.error('Error:', error));
    }
};
