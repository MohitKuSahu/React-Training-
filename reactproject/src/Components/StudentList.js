import React, { useEffect } from 'react';
import './RegistrationForm.css'


const DisplayStudentList = () => {
    const jsonData = localStorage.getItem('studentData');
    const students = JSON.parse(jsonData).Students;
    const studentTable = document.getElementById('studentTable');

    const headerHTML = `
      <tr>
        <th>Full Name</th>
        <th>Email</th>
        <th>Edit</th>
        <th>Delete</th>
     </tr>
   `;

    studentTable.innerHTML = headerHTML;
    students.forEach((student, index) => {
        const firstName = student.FirstName;
        const lastName = student.LastName;
        

        const row = studentTable.insertRow();
        const cellFullName = row.insertCell(0);
        const cellEmailAddress=row.insertCell(1);
        const cellEdit = row.insertCell(2);
        const cellDelete = row.insertCell(3);

        cellFullName.textContent = firstName + ' ' + lastName;
        cellFullName.style.fontFamily = "Verdana, Geneva, sans-serif";

        cellEmailAddress.textContent=student.EmailAddress;
        cellEmailAddress.style.fontFamily="Verdana, Geneva, sans-serif";

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('button', 'edit-button');
        editButton.addEventListener('click', () => {
             clearValidationMessages();
             populateFormWithStudentDetails(student, index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('button', 'delete-button');
        deleteButton.addEventListener('click', () => {
            const confirmDelete = window.confirm(`Are you sure you want to delete ${student.FirstName+""+student.LastName}?`);
            if (confirmDelete) {
                row.remove();
                removeStudentFromLocalStorage(student);
                alert(`${student.FirstName} deleted successfully.`);
                window.location.reload();
            }
        });

        cellEdit.appendChild(editButton);
        cellDelete.appendChild(deleteButton);
    });
};

const populateFormWithStudentDetails = (student, index) => {
    const registrationForm = document.getElementById('registration-form');
    const formElements = registrationForm.elements;

    const fieldNames = Object.keys(student);
    for (let i = 0; i < fieldNames.length; i++) {
        const fieldName = fieldNames[i];
        if (fieldName === 'Hobbies') {
            const hobbiesCheckboxes = formElements['Hobbies'];
            for (let j = 0; j < hobbiesCheckboxes.length; j++) {
                hobbiesCheckboxes[j].checked = student.Hobbies.includes(hobbiesCheckboxes[j].value);
            }
        } else {
            formElements[fieldName].value = student[fieldName];
        }
    }

    formElements['editIndex'].value = index;
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    submitButton.textContent = "Update";
};

const removeStudentFromLocalStorage = (student) => {
    const jsonData = localStorage.getItem('studentData');
    const students = JSON.parse(jsonData).Students;

    const updatedStudents = students.filter(s => s.EmailAddress!=student.EmailAddress);

    localStorage.setItem('studentData', JSON.stringify({ Students: updatedStudents }));
};

const clearValidationMessages = () => {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(errorMessage => {
      errorMessage.textContent = '';
    });
  };

const StudentList = () => {
    useEffect(() => {
        DisplayStudentList();
    }, []);

    return (
        <section className="display-user">
            <header>Student Lists</header>
            <table id="studentTable"></table>
        </section>
       
    )
}

export { StudentList, DisplayStudentList };
