import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, FormHelperText, Grid } from '@mui/material';
import api from '../API/APICalls';

function ShipmentInfoDialog({ onAdd = () => { }, onUpdate = () => { }, open, onClose, initialData }) {
  const isEditing = !!initialData;

  const [shipmentData, setShipmentData] = useState({
    origin: '',
    destination: '',
    status: '',
    trackingInfo: '',
    date: '',
    ...initialData
  });
  const [formSubmitted, setFormSubmitted] = useState(false);


  useEffect(() => {
    if (initialData) {
      setShipmentData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipmentData({ ...shipmentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!shipmentData.origin || !shipmentData.destination || !shipmentData.status || !shipmentData.date) {
      return;
    }
    try {
      const { date, ...postData } = shipmentData;
      let trackingInfo = '';
      const dates = new Date(date);
      const formattedDate = `${(dates.getMonth() + 1).toString().padStart(2, '0')}/${dates.getDate().toString().padStart(2, '0')}/${dates.getFullYear()}`;
      switch (shipmentData.status) {
        case 'In transit':
          trackingInfo = `ETA: ${formattedDate}`;
          break;
        case 'Delivered':
          trackingInfo = `Delivered on ${formattedDate}`;
          break;
        case 'Delayed':
          trackingInfo = `Delayed - new ETA: ${formattedDate}`;
          break;
        default:
          trackingInfo = 'Unknown status';
      }
      const postDataWithTrackingInfo = { ...postData, trackingInfo };
      if (isEditing) {
        const response = await api.put(`/shipments/${shipmentData.id}`, postDataWithTrackingInfo);
        console.log('Updated Shipment:', response);
        onUpdate(response.data);
        onClose();
        setFormSubmitted(false);
        window.alert('Shipment updated successfully!');
        setShipmentData({
          origin: '',
          destination: '',
          status: '',
          trackingInfo: '',
          date: ''
        });
      } else {
        const response = await api.post('/shipments', postDataWithTrackingInfo);
        console.log('Added Shipment:', response);
        onAdd(response.data);
        onClose();
        setFormSubmitted(false);
        window.alert('Shipment added successfully!');
        setShipmentData({
          origin: '',
          destination: '',
          status: '',
          trackingInfo: '',
          date: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleCancel = () => {
    onClose();
    setFormSubmitted(false);
    setShipmentData({
      origin: '',
      destination: '',
      status: '',
      trackingInfo: '',
      date: ''
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Edit Shipment' : 'Add New Shipment'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Origin *"
                id="origin"
                name="origin"
                value={shipmentData.origin}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!shipmentData.origin && formSubmitted}
              />
              {!shipmentData.origin && formSubmitted && (
                <FormHelperText error style={{ fontSize: '0.9rem' }}>Please provide the origin.</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Destination *"
                id="destination"
                name="destination"
                value={shipmentData.destination}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!shipmentData.destination && formSubmitted}
              />
              {!shipmentData.destination && formSubmitted && (
                <FormHelperText error style={{ fontSize: '0.9rem' }}>Please provide the destination.</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status *</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={shipmentData.status}
                  label="Status"
                  name="status"
                  onChange={handleChange}
                  error={!shipmentData.status && formSubmitted}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="In transit">In transit</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Delayed">Delayed</MenuItem>
                </Select>
                {!shipmentData.status && formSubmitted && (
                  <FormHelperText error style={{ fontSize: '0.9rem' }}>Please select a status.</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date *"
                id="date"
                name="date"
                type="date"
                value={shipmentData.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  style: { width: '100px' }
                }}
                error={!shipmentData.date && formSubmitted}
              />
              {!shipmentData.date && formSubmitted && (
                <FormHelperText error style={{ fontSize: '0.9rem' }}>Please provide the date.</FormHelperText>
              )}
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              backgroundColor: '#00897B',
              '&:hover': {
                backgroundColor: '#00897B', 
              },
              '&:active': {
                backgroundColor: '#00897B', 
              }
            }} >{isEditing ? 'Update Shipment' : 'Add Shipment'}</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ShipmentInfoDialog;
