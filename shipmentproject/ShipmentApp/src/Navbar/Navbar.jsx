import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LocalShipping, FlightTakeoff, ExitToApp } from '@mui/icons-material';
import GridOnIcon from '@mui/icons-material/GridOn';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

const NavigationBar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logging out...');
    alert('Logging Out');
    setIsAuthenticated(false);
    navigate('/LoginPage');

  };

  return (
    <AppBar position="fixed" sx={{ top: 0, backgroundColor: '#00897B' }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item>
            <FlightTakeoff sx={{ marginRight: '10px' }} />
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              Shipment Tracker
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={Link}
            to="/ShipmentMap"
            sx={{
              '&:hover': {
                backgroundColor: '#00695C',
              },
              ...(location.pathname === '/ShipmentMap' && {
                backgroundColor: '#00695C',
              }),
              marginRight: '10px',
            }}
          >
            <MapOutlinedIcon sx={{ mr: 1 }} />
            Track your Shipping
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/ShipmentDetails"
            sx={{
              '&:hover': {
                backgroundColor: '#00695C',
              },
              ...(location.pathname === '/ShipmentDetails' && {
                backgroundColor: '#00695C',
              }),
              marginRight: '10px',
            }}
          >
            <LocalShipping sx={{ mr: 1 }} />
            Shipment Details
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/GridView"
            sx={{
              '&:hover': {
                backgroundColor: '#00695C',
              },
              ...(location.pathname === '/GridView' && {
                backgroundColor: '#00695C',
              }),
              marginRight: '10px',
            }}
          >
            <GridOnIcon sx={{ mr: 1 }} />
            Grid View
          </Button>
          {(location.pathname !== '/LoginPage' && location.pathname !== '/SignUp') && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: '#00695C',
                },
                marginRight: '10px',
              }}
            >
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </Button>
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
