import React from 'react'

const Select = ({ label, name, options, mandatory,error }) => {
    return (
      <div className="input-box">
        <label className={mandatory ? "mandatory" : ""} htmlFor={name}>{label}</label>
        <div className="select-box">
          <select id={name} name={name} className={mandatory ? "mandatoryInput" : ""}>
            <option hidden value="">Select {label}</option>
            {options.map((option, index) => (
              <option value={option} key={index}>{option}</option>
            ))}
          </select>
        </div>
        {mandatory && <span className="error-message" id={`${name}Error`}>{error}</span>}
      </div>
    );
  };

export default Select
