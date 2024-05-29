import React, { useState,useEffect} from 'react';
import { TextField, Button, Typography, CircularProgress, Grid,Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import api from '../API/APICalls';
import Map from '../ShipmentTracking/Map'; 

const ShipmentMap = ({ isAuthenticated }) => {
  const [shippingId, setShippingId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); 


  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/LoginPage');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.get(`/shipments/${shippingId}`);
      const { origin, destination } = response.data;
      setOrigin(origin);
      setDestination(destination);
      setShowMap(true);
      setErrorMessage(''); 
      setMapKey(Date.now()); 
    } catch (error) {
      setErrorMessage('Error fetching shipment data.');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Shipping ID"
              value={shippingId}
              onChange={(e) => setShippingId(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Box mt={4}>
        {showMap && <Map key={mapKey} origin={origin} destination={destination} />}
      </Box>
    </div>
  );
};

export default ShipmentMap;
