document.addEventListener('DOMContentLoaded', function () {
    // Get the student ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    // Fetch student details using the ID
    if (studentId) {
        fetch(`http://localhost:8080/student/find-by-id/${studentId}`)
            .then(response => response.json())
            .then(student => {
                // Populate the form with student data
                document.getElementById('studentId').value = student.studentId;
                document.getElementById('txtStdName').value = student.studentName;
                document.getElementById('txtStdAge').value = student.studentAge;
                document.getElementById('txtStdContact').value = student.studentContactNumber;
                document.getElementById('txtGuardianName').value = student.guardianName;
                document.getElementById('txtGuardianAddress').value = student.guardianAddress;
                document.getElementById('txtGuardianContact').value = student.guardianContactNumber;

                // Display the student's image
                if (student.studentImage) {
                    const studentImageElement = document.getElementById('studentImage');
                    studentImageElement.src = `data:image/jpeg;base64,${student.studentImage}`;
                }
            })
            .catch(error => {
                console.error('Error fetching student details:', error);
                alert('Failed to load student details.');
            });
    } else {
        alert('No student ID provided.');
    }
});
