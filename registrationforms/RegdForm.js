
document.addEventListener('DOMContentLoaded', function () {
    displayStudentList();
    const registrationForm = document.getElementById('registration-form');


    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var valid = true;

        if (!validateForm(valid)) {
            return;
        }

        const formData = new FormData(registrationForm);
        const formObject = {};

        formData.forEach((value, key) => {
            if (key === 'Hobbies') {
                const checkedHobbies = Array.from(formData.getAll('Hobbies'));
                formObject[key] = checkedHobbies;
            } else {
                formObject[key] = value;
            }
        });

        const editIndex = parseInt(formData.get('editIndex'));
        const jsonData = localStorage.getItem('studentData');
        let students = [];
        if (jsonData) {
            students = JSON.parse(jsonData).Students;
        }


        if (!isNaN(editIndex) && editIndex >= 0 && editIndex < students.length) {
            students[editIndex] = formObject;
            alert('Form updated successfully');
            const submitButton = registrationForm.querySelector('button[type="submit"]');
            submitButton.textContent = "Submit";
        } else {
            students.push(formObject);
            alert('Form submitted successfully');
        }

        const updatedData = { Students: students };
        localStorage.setItem('studentData', JSON.stringify(updatedData));

        registrationForm.reset();

        displayStudentList();
    });
});


function displayStudentList() {
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
            const confirmDelete = confirm(`Are you sure you want to delete ${student.FirstName}?`);
            if (confirmDelete) {
                row.remove();
                removeStudentFromLocalStorage(student);
                alert(`${student.FirstName} deleted successfully.`);
                location.reload();
            }
        });

        cellEdit.appendChild(editButton);
        cellDelete.appendChild(deleteButton);
    });
}

function populateFormWithStudentDetails(student, index) {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.elements['FirstName'].value = student.FirstName;
    registrationForm.elements['LastName'].value = student.LastName;
    registrationForm.elements['PhoneNumber'].value = student.PhoneNumber;
    registrationForm.elements['BirthDate'].value = student.BirthDate;
    registrationForm.elements['EmailAddress'].value = student.EmailAddress;
    registrationForm.elements['Password'].value = student.Password;
    registrationForm.elements['Password'].type = "text";
    registrationForm.elements['Gender'].value = student.Gender;
    registrationForm.elements['StreetAddress1'].value = student.StreetAddress1;
    registrationForm.elements['StreetAddress2'].value = student.StreetAddress2;
    registrationForm.elements['Country'].value = student.Country;
    registrationForm.elements['City'].value = student.City;
    registrationForm.elements['Region'].value = student.Region;
    registrationForm.elements['PostalCode'].value = student.PostalCode;

    const hobbiesCheckboxes = registrationForm.elements['Hobbies'];
    hobbiesCheckboxes.forEach(checkbox => {
        checkbox.checked = student.Hobbies.includes(checkbox.value);
    });

    registrationForm.elements['editIndex'].value = index;
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    submitButton.textContent = "Update";
}



function removeStudentFromLocalStorage(student) {
    const jsonData = localStorage.getItem('studentData');
    const students = JSON.parse(jsonData).Students;

    const index = students.findIndex(s => s.FirstName === student.FirstName && s.LastName === student.LastName);

    if (index !== -1) {
        students.splice(index, 1);
        localStorage.setItem('studentData', JSON.stringify({ Students: students }));
    }
}

function validateForm(valid) {
    const mandatoryInputs = document.querySelectorAll('.mandatoryInput');
    mandatoryInputs.forEach(input => {
        const errorMessage = input.nextElementSibling;
        const inputName = input.getAttribute('name');

        if (input.value.trim() === '') {
            errorMessage.textContent = `${inputName} is required.`;
            valid = false;
        } else {
            errorMessage.textContent = '';
        }
    });
    return valid;
}


function validateEmail() {
    var emailInput = document.getElementById('emailInput');
    var emailError = document.getElementById('emailError');
    var email = emailInput.value.toLowerCase();
    var editIndex = parseInt(document.getElementById('editIndex').value);

    const jsonData = localStorage.getItem('studentData');
    const students = JSON.parse(jsonData).Students;

    var emailExists = students.some((s, index) => s.EmailAddress.toLowerCase() === email && index !== editIndex);


    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        emailError.textContent = 'Invalid email address';
        emailError.style.display = 'block';
        emailInput.classList.add('invalid');
        return false;
    } else {
        if (emailExists) {
            emailError.textContent = 'Email address already taken';
            emailError.style.display = 'block';
            emailInput.classList.add('invalid');
            return false;
        } else {
            emailError.textContent = '';
            emailError.style.display = 'none';
            emailInput.classList.remove('invalid');
            return true;
        }
    }
}


function validatePhoneNumber() {
    var phoneInput = document.getElementById('phoneInput');
    var phoneError = document.getElementById('phoneError');
    var phoneNumber = phoneInput.value.trim();


    var phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Phone number must be 10 digits.';
        phoneError.style.display = 'block';
        phoneInput.classList.add('invalid');
        return false;
    } else {
        phoneError.textContent = '';
        phoneError.style.display = 'none';
        phoneInput.classList.remove('invalid');
        return true;
    }
}


function validatePassword() {
    var passwordInput = document.getElementById('passwordInput');
    var passwordError = document.getElementById('passwordError');
    var password = passwordInput.value;

    var passwordRegex = /^\d{8}$/;

    if (!passwordRegex.test(password)) {
        passwordError.textContent = 'Password must be at least 8 characters long';
        passwordError.style.display = 'block';
        passwordInput.classList.add('invalid');
        return false;
    } else {
        passwordError.textContent = '';
        passwordError.style.display = 'none';
        passwordInput.classList.remove('invalid');
        return true;
    }
}

function validatePostalCode() {
    var postalCodeInput = document.getElementById('postalCodeInput');
    var postalCodeError = document.getElementById('postalCodeError');
    var postalCode = postalCodeInput.value.trim();


    var postalCodeRegex = /^\d+$/;

    if (!postalCodeRegex.test(postalCode)) {
        postalCodeError.textContent = 'Postal code must contain only digits';
        postalCodeError.style.display = 'block';
        postalCodeInput.classList.add('invalid');
        return false;
    } else {
        postalCodeError.textContent = '';
        postalCodeError.style.display = 'none';
        postalCodeInput.classList.remove('invalid');
        return true;
    }
}



function clearValidationMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(errorMessage => {
        errorMessage.textContent = '';
    });
}

const mandatoryInputs = document.querySelectorAll('.mandatoryInput');

mandatoryInputs.forEach(input => {
    const errorMessage = input.nextElementSibling;
    const inputName = input.getAttribute('name');

    input.addEventListener('input', () => {
        if (input.value.trim() === '') {
            errorMessage.textContent = `${inputName} is required.`;
            valid = false;
            return;
        }

        switch (inputName) {
            case 'PhoneNumber':
                validatePhoneNumber(input, errorMessage);
                break;
            case 'EmailAddress':
                validateEmail(input, errorMessage);
                break;
            case 'Password':
                validatePassword(input, errorMessage);
                break;
            case 'PostalCode':
                validatePostalCode(input, errorMessage);
                break;
            default:
                errorMessage.textContent = '';
        }
    });
});







