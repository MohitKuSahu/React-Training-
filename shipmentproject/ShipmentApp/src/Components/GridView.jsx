import React, { useState, useEffect, useRef } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Box, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../API/APICalls';
import { useNavigate } from "react-router-dom";
import ShipmentInfoDialog from '../Dialog/ShipmentInfoDialog';
import DeleteDialog from '../Dialog/DeleteDialog';

const ShipmentDetails = ({ isAuthenticated }) => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteShipmentId, setDeleteShipmentId] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  

  const navigate = useNavigate();
  const loader = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/LoginPage');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/shipments');
        setShipments(response.data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !loadingMore && hasMore) {
          setLoadingMore(true);
          loadMoreShipments();
        }
      }, 200); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadingMore, hasMore]);

  const loadMoreShipments = async () => {
    try {
      const response = await api.get('/shipments', {
        params: {
          _start: shipments.length,
          _limit: 0 
        }
      });
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }
      setShipments(prevShipments => [...prevShipments, ...response.data]);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching more shipments:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEdit = (shipment) => {
    setSelectedShipment(shipment);
    setOpenModal(true);
    setModalKey(prevKey => prevKey + 1);
  };

  const handleDelete = async () => {
    if (!deleteShipmentId) {
      console.error('No shipment selected for deletion.');
      return;
    }
    try {
      await api.delete(`/shipments/${deleteShipmentId}`);
      setShipments(prevShipments => prevShipments.filter(shipment => shipment.id !== deleteShipmentId));
      setOpenDeleteDialog(false);
      alert('Deleted Successfully!!');
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const handleAddShipment = (newShipment) => {
    setShipments(prevShipments => [...prevShipments, newShipment]);
    setOpenModal(false);
  };

  const handleUpdateShipment = (updatedShipment) => {
    const updatedShipments = shipments.map(shipment =>
      shipment.id === updatedShipment.id ? updatedShipment : shipment
    );
    setShipments(updatedShipments);
    setOpenModal(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredShipments = shipments.filter(shipment =>
    Object.values(shipment).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery)
    )
  );

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom style={{ fontFamily: "Times New Roman", marginBottom: '20px', fontWeight: "bold" }}>
        Shipment Details
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          onClick={handleOpenModal}
        >
          Add New Shipment
        </Button>
        <ShipmentInfoDialog key={modalKey} open={openModal} onAdd={handleAddShipment} onClose={handleCloseModal} initialData={selectedShipment} onUpdate={handleUpdateShipment} />
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
          size="small"
        />
      </Box>
      <Grid container spacing={2}>
        {filteredShipments.map((shipment, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={`${shipment.id}-${index}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  ID: {shipment.id}
                </Typography>
                <Typography color="textSecondary">
                  Origin: {shipment.origin}
                </Typography>
                <Typography color="textSecondary">
                  Destination: {shipment.destination}
                </Typography>
                <Typography color="textSecondary">
                  Status: {shipment.status}
                </Typography>
                <Typography color="textSecondary">
                  Tracking Info: {shipment.trackingInfo}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <IconButton onClick={() => handleEdit(shipment)} style={{ color: 'green' }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setOpenDeleteDialog(true);
                    setDeleteShipmentId(shipment.id);
                  }} style={{ color: 'red' }}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ShipmentDetails;
