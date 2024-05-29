import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'
import { TypedInput, ChoiceInput } from './Input';
import Select from './Select';
import { DisplayStudentList } from './StudentList';
import Validation from './Validation';

const RegistrationForm = () => {
    const [students, setStudents] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const jsonData = localStorage.getItem('studentData');
        if (jsonData) {
            setStudents(JSON.parse(jsonData).Students);
        }
    }, []);

    const checkFormValidity = () => {
        const inputs = document.querySelectorAll('.mandatoryInput');
        let isValid = true;
        let errors = {};

        inputs.forEach(input => {
            const fieldName = input.getAttribute('name');
            const inputValue = input.value.trim();

            if (input.type === 'radio' || input.type === 'checkbox') {
                const inputGroup = document.querySelectorAll(`input[name="${fieldName}"]:checked`);
                if (inputGroup.length === 0) {
                    errors[fieldName] = `Please select ${fieldName}.`;
                    isValid = false;
                }
            } else {
                if (inputValue === '') {
                    errors[fieldName] = `${fieldName} is required.`;
                    isValid = false;
                } else if (fieldName === 'EmailAddress' || fieldName === 'PhoneNumber' || fieldName === 'Password' || fieldName === 'PostalCode') {
                    const isValidField = Validation[fieldName](inputValue);
                    if (!isValidField) {
                        errors[fieldName] = `Invalid ${fieldName}.`;
                        isValid = false;
                    }
                }
            }

            input.addEventListener('focus', () => {
                const errorElement = document.getElementById(`${fieldName}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });

        });

        setFormErrors(errors);
        return isValid;
    };

    // const clearValidationMessagesUpdateError = () => {
    //     const errorMessages = document.querySelectorAll('.error-messages-update');
    //     errorMessages.forEach(errorMessage => {
    //       errorMessage.textContent = '';
    //     });
    //   };


    const submitHandler = (event) => {
        event.preventDefault();
        //clearValidationMessagesUpdateError();
        if (!checkFormValidity()) {
            console.log('Form has errors, submission prevented');
            return;
        }


        const formData = new FormData(event.target);
        const formObject = {};

        formData.forEach((value, key) => {
            if (formData.getAll(key).length > 1) {
                const checkedValues = Array.from(formData.getAll(key));
                formObject[key] = checkedValues;
            } else {
                formObject[key] = value;
            }
        });

        const editIndex = parseInt(formData.get('editIndex'));
        let updatedStudents = [];


        if (!isNaN(editIndex) && editIndex >= 0 && editIndex < students.length) {
            updatedStudents = [...students];
            updatedStudents[editIndex] = formObject;
            alert('Form updated successfully');
            const submitButton = document.getElementById('registration-form').querySelector('button[type="submit"]');
            submitButton.textContent = "Submit";
        } else {
            updatedStudents = [...students, formObject];
            alert('Form submitted successfully');
        }

        setStudents(updatedStudents);
        localStorage.setItem('studentData', JSON.stringify({ Students: updatedStudents }));
        window.location.reload();
        DisplayStudentList();

    };


    return (
        <section className="container">
            <header>Registration Form</header>
            <form className="form" id="registration-form" onSubmit={submitHandler} noValidate>
                <h2>Profile</h2>
                <div className="row">
                    <TypedInput
                        label="First Name"
                        type="text"
                        name="FirstName"
                        mandatory
                        error={formErrors.FirstName}
                    />
                    <TypedInput
                        label="Last Name"
                        type="text"
                        name="LastName"
                        mandatory
                        error={formErrors.LastName}
                    />
                </div>

                <div className="row">
                    <TypedInput
                        label="Phone Number"
                        type="tel"
                        name="PhoneNumber"
                        mandatory
                        error={formErrors.PhoneNumber}
                    />
                    <TypedInput
                        label="Date Of Birth"
                        type="date"
                        name="BirthDate"
                        mandatory
                        error={formErrors.BirthDate}
                    />
                </div>

                <div className="row">
                    <TypedInput
                        label="Email Address"
                        type="email"
                        name="EmailAddress"
                        mandatory
                        error={formErrors.EmailAddress}
                    />
                    <TypedInput
                        label="Password"
                        type="password"
                        name="Password"
                        mandatory
                        error={formErrors.Password}
                    />
                </div>

                <ChoiceInput
                    label="Gender"
                    type="radio"
                    name="Gender"
                    options={['Male', 'Female', 'Not to Say']}
                    mandatory
                    error={formErrors.Gender}
                />

                <div className="input-box address">
                    <h2>Address</h2>
                    <div className="row">
                        <TypedInput
                            label="Street Address Line 1"
                            type="text"
                            name="StreetAddress1"
                            mandatory
                            error={formErrors.StreetAddress1}
                        />
                        <TypedInput
                            label="Street Address Line 2"
                            type="text"
                            name="StreetAddress2"
                        />
                    </div>

                    <div className="row">
                        <Select
                            label="Country"
                            type="select"
                            name="Country"
                            options={['America', 'Japan', 'India', 'Nepal']}
                            mandatory
                            error={formErrors.Country}
                        />
                        <TypedInput
                            label="City"
                            type="text"
                            name="City"
                            mandatory
                            error={formErrors.City}
                        />
                    </div>

                    <div className="row">
                        <TypedInput
                            label="Region"
                            type="text"
                            name="Region"
                            mandatory
                            error={formErrors.Region}
                        />
                        <TypedInput
                            label="Postal Code"
                            type="text"
                            name="PostalCode"
                            mandatory
                            error={formErrors.PostalCode}
                        />
                    </div>
                </div>

                <ChoiceInput
                    label="Hobbies"
                    type="checkbox"
                    name="Hobbies"
                    options={['Cooking', 'Travelling', 'Reading', 'Others']}
                    mandatory
                    error={formErrors.Hobbies}
                />

                <input type="hidden" id="editIndex" name="editIndex" value="" />
                <button type="submit">Submit</button>
            </form>
        </section>
    )
}

export default RegistrationForm