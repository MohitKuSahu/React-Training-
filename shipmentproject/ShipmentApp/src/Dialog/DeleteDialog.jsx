import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteDialog = ({ open, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Shipment</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this shipment?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onDelete} variant="contained" sx={{
                    backgroundColor: '#00897B',
                    '&:hover': {
                        backgroundColor: '#00897B', 
                    },
                    '&:active': {
                        backgroundColor: '#00897B',
                    }
                }}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
