import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, Box } from '@mui/material';
import api from '../API/APICalls';

function ShipmentDetails() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [shipments, setShipments] = useState([]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetchShipments = async (query) => {
    try {
      const url = buildUrl(query);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }
      const data = await response.json();
      const totalCount = data.items; 
      setTotalCount(totalCount);
      return data.data; 
    } catch (error) {
      console.error('Error fetching shipments:', error);
      return [];
    }
  };


  useEffect(() => {
    const query = {
      page: page + 1,
      perPage: rowsPerPage,
      order: order,
      orderBy: orderBy,
      searchQuery: searchQuery
    };
    fetchShipments(query)
      .then(data => {
        try {
          setShipments(data);
        } catch (error) {
          console.error('Error: Fetch returned invalid data format' + error);
        }
      })
      .catch(error => console.error('Error fetching shipments:', error));
  }, [page, rowsPerPage, order, orderBy, searchQuery]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };


  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const buildUrl = (query) => {
    let url = 'shipments?';

    url += `_page=${query.page}&_per_page=${query.perPage}`;

    if (query.orderBy) {
      const sortOrder = query.order === 'asc' ? '' : '-';
      const sortBy = query.orderBy;
      url += `&_sort=${sortOrder}${sortBy}`;
    }
   
    if (query.searchQuery) {
      url += `&search=${query.searchQuery}`; 
    }

    return api.defaults.baseURL + url;
  };

  return (
    <Box textAlign="center">
      <h1>Shipment Details</h1>
      <TextField
        label="Search"
        variant="outlined"
        onChange={handleSearch}
        size="small"
      />
      <TableContainer component={Paper}>
        <Table aria-label="shipment table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={order}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'origin'}
                  direction={order}
                  onClick={() => handleSort('origin')}
                >
                  Origin
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'destination'}
                  direction={order}
                  onClick={() => handleSort('destination')}
                >
                  Destination
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={order}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trackingInfo'}
                  direction={order}
                  onClick={() => handleSort('trackingInfo')}
                >
                  Tracking Info
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>{shipment.trackingInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
}

export default ShipmentDetails;
