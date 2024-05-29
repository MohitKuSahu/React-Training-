import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, styled, Link, Box, FormHelperText } from '@mui/material';
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

const LoginForm = styled('form')({
  marginTop: '1.5rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const IconContainer = styled('div')({
  marginBottom: '1rem',
});

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }

    if (!email || !password) {
      return;
    }

    try {
      const response = await api.get('/users');
      const users = response.data;
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        const token = "authenticate";
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate('/ShipmentDetails');
        alert("Successfully Login");
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Error logging in. Please try again later.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  };

  return (
    <FormContainer maxWidth="xs">
      <IconContainer>
        <AccountCircle sx={{ fontSize: '4rem' }} />
      </IconContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          type="text"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{ marginBottom: '1rem' }}
          InputProps={{
            startAdornment: (
              <Email sx={{ color: 'grey' }} />
            ),
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
            startAdornment: (
              <VpnKey sx={{ color: 'grey' }} />
            ),
          }}
          error={!!passwordError}
          helperText={passwordError}
        />
        {loginError && (
          <FormHelperText error sx={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }} >
            {loginError}
          </FormHelperText>
        )}
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00897B',
            '&:hover': {
              backgroundColor: '#00897B',
            },
            '&:active': {
              backgroundColor: '#00897B',
            }
          }}
          type="submit"
          fullWidth
        >
          Login
        </Button>
      </LoginForm>
      <Box mt={2}>
        <Typography variant="body1">
          Don't have an account? {' '}
          <Link onClick={() => navigate('/SignUp')} underline="hover">
            Create Account
          </Link>
        </Typography>
      </Box>
    </FormContainer>
  );
};

export default LoginPage;
