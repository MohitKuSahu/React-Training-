import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, styled, Link, Box} from '@mui/material';
import { AccountCircle, Email, VpnKey } from '@mui/icons-material';
import api from '../API/APICalls';

const FormContainer = styled(Container)({
  marginTop: '3rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '2rem',
});

const SignUpForm = styled('form')({
  marginTop: '1.5rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const IconContainer = styled('div')({
  marginBottom: '1rem',
});

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setNameError('Name is required');
    }

    if (!email) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
    }

    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    }

    if (name && email && /\S+@\S+\.\S+/.test(email) && password && password.length >= 8) {
      try {
        const response = await api.get('/users');
        const users = response.data;
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
          setEmailError('Email already exists');
        } else {
          await api.post('/users', { name, email, password });
          window.alert('User added successfully! You are going to be redirected to the Login page.');
          navigate('/LoginPage');
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <FormContainer maxWidth="xs">
      <IconContainer>
        <AccountCircle sx={{ fontSize: '4rem' }} />
      </IconContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <SignUpForm onSubmit={handleSignUp}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          sx={{ marginBottom: '1rem' }}
          InputProps={{
            startAdornment: <AccountCircle sx={{ color: 'grey' }} />,
          }}
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="text"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{ marginBottom: '1rem' }}
          InputProps={{
            startAdornment: <Email sx={{ color: 'grey' }} />,
          }}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          sx={{ marginBottom: '1rem' }}
          InputProps={{
            startAdornment: <VpnKey sx={{ color: 'grey' }} />,
          }}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00897B',
            '&:hover': {
              backgroundColor: '#00897B',
            },
            '&:active': {
              backgroundColor: '#00897B',
            },
          }}
          type="submit"
          fullWidth
        >
          Sign Up
        </Button>
      </SignUpForm>
      <Box mt={2}>
        <Typography variant="body1">
          Already have an account?{' '}
          <Link onClick={() => navigate('/LoginPage')} underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </FormContainer>
  );
};

export default SignUpPage;
