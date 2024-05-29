import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, styled, Button, Typography, Box, TextField, IconButton } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Edit, Delete } from '@mui/icons-material';
import api from '../API/APICalls';
import { useNavigate } from "react-router-dom";
import ShipmentInfoDialog from '../Dialog/ShipmentInfoDialog';
import DeleteDialog from '../Dialog/DeleteDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '& .MuiTableSortLabel-icon': {
    color: theme.palette.common.white,
  },
}));

const ShipmentDetails = ({ isAuthenticated }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState('asc');
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteShipmentId, setDeleteShipmentId] = useState(null);
  const [modalKey, setModalKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/LoginPage');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await api.get('/shipments');
        setShipments(response.data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      }
    };

    fetchShipments();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedShipments = orderBy
    ? [...shipments].sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    })
    : shipments;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const filteredShipments = sortedShipments.filter(shipment =>
    Object.values(shipment).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery)
    )
  );

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom style={{ fontFamily: "Times New Roman", marginBottom: '20px', fontWeight: "bold" }}>
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
      <TableContainer component={Paper}>
        <Table aria-label="shipment table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                  style={{ fontWeight: 'bold' }}
                >
                  ID
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === 'origin'}
                  direction={orderBy === 'origin' ? order : 'asc'}
                  onClick={() => handleSort('origin')}
                  style={{ fontWeight: 'bold' }}
                >
                  Origin
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === 'destination'}
                  direction={orderBy === 'destination' ? order : 'asc'}
                  onClick={() => handleSort('destination')}
                  style={{ fontWeight: 'bold' }}
                >
                  Destination
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                  style={{ fontWeight: 'bold' }}
                >
                  Status
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === 'trackingInfo'}
                  direction={orderBy === 'trackingInfo' ? order : 'asc'}
                  onClick={() => handleSort('trackingInfo')}
                  style={{ fontWeight: 'bold' }}
                >
                  Tracking Info
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  style={{ fontWeight: 'bold' }}
                >
                  Actions
                </StyledTableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {filteredShipments.length === 0 ? (
            <TableBody>
              <StyledTableRow>
                <StyledTableCell colSpan={6}>
                  <Typography variant="body1" style={{ marginTop: '10px', textAlign: 'center' }}>
                    No data available
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredShipments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((shipment) => (
                  <StyledTableRow key={shipment.id}>
                    <StyledTableCell>{shipment.id}</StyledTableCell>
                    <StyledTableCell>{shipment.origin}</StyledTableCell>
                    <StyledTableCell>{shipment.destination}</StyledTableCell>
                    <StyledTableCell>{shipment.status}</StyledTableCell>
                    <StyledTableCell>{shipment.trackingInfo}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={() => handleEdit(shipment)}
                        style={{ color: 'green' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setOpenDeleteDialog(true);
                          setDeleteShipmentId(shipment.id);
                        }}
                        style={{ color: 'red' }}
                      >
                        <Delete />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredShipments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ShipmentDetails;
