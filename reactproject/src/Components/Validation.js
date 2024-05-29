const Validation = {
  EmailAddress: (value) => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(value);
  },
  PhoneNumber: (value) => {
     const phoneRegex = /^\d{10}$/;
     return phoneRegex.test(value);
  },
  Password: (value) => {
     return value.length >= 8;
  },
  PostalCode: (value) => {
     const postalCodeRegex = /^\d{5}$/;
     return postalCodeRegex.test(value);
  },

 };
 
 export default Validation;
 