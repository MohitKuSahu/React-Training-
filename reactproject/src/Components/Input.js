import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'
import Validation from './Validation';

const TypedInput = ({ label, type, name, mandatory, error }) => {
  const [value, setValue] = useState('');
  const [updateError, setError] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const jsonData = localStorage.getItem('studentData');
    if (jsonData) {
      const parsedData = JSON.parse(jsonData);
      setStudents(parsedData.Students);
    }
  }, []);


  const handleChange = (event) => {
    const inputValue = event.target.value.trim();
    setValue(inputValue);

    if (mandatory && inputValue === '') {
      setError(`${name} is required.`);
    } else if (name === 'EmailAddress') {
      const isValidField = Validation[name](inputValue);
      if (!isValidField) {
        setError(`Invalid ${name}.`);
      } else {
        const emailExists = students.some((student) => student.EmailAddress.toLowerCase() === inputValue.toLowerCase());
        if (emailExists) {
          setError('Email address already exists.');
        } else {
          setError('');
        }
      }
    } else if (['PhoneNumber', 'Password', 'PostalCode'].includes(name)) {
      const isValidField = Validation[name](inputValue);
      if (!isValidField) {
        setError(`Invalid ${name}.`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };


  const handleBlur = () => {
    if (mandatory && value === '') {
      setError(`${name} is required.`);
    } else if (['EmailAddress', 'PhoneNumber', 'Password', 'PostalCode'].includes(name)) {
      const isValidField = Validation[name](value);
      if (!isValidField) {
        setError(`Invalid ${name}.`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  return (
    <div className="input-box">
      <label className={mandatory ? "mandatory" : ""}>{label}</label>
      <input
        type={type}
        placeholder={`Enter your ${name}`}
        name={name}
        className={mandatory ? "mandatoryInput" : ""}
        id={`${name}Input`}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
      />
      {mandatory && <span className="error-message" id={`${name}Error`}>{error}</span>}
      {mandatory && <span className="error-messages-update" id={mandatory ? "mandatoryError" : ""}>{updateError}</span>}
    </div>
  );
};

export default TypedInput;


const ChoiceInput = ({ label, type, name, options, mandatory, error }) => {
  const [updateError, setError] = useState('');

  const handleChange = () => {
    if (mandatory && !options.some(option => document.getElementById(option).checked)) {
      setError(`${label} is required.`);
    } else {
      setError('');
    }
  };

  const handleBlur = () => {
    if (mandatory && !options.some(option => document.getElementById(option).checked)) {
      setError(`${label} is required.`);
    } else {
      setError('');
    }
  };

  return (
    <div className="choice-box">
      <h3 className={mandatory ? "mandatory" : ""}>{label}</h3>
      <div className="choice-option">
        {options.map((option, index) => (
          <div className="choice" key={index}>
            <input
              type={type}
              id={option}
              className={mandatory ? "mandatoryInput" : ""}
              name={name}
              value={option}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
      {mandatory && <span className="error-message" id={`${name}Error`}>{error}</span>}
      {mandatory && <span className="error-messages-update" id={mandatory ? "mandatoryError" : ""}>{updateError}</span>}
    </div>
  );
};


export { TypedInput, ChoiceInput };
