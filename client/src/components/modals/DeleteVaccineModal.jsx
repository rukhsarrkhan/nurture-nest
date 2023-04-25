import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DeleteModal = (props) => {

    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p className='P-title-home'>
                        Are you sure you want to delete this?
                    </p>
                    <Button variant="outlined" color="secondary" type="submit" onClick={() => props.deleteVaccine(props._id)}>
                        Yes
                    </Button>
                    <Button onClick={props.onClose}>
                        No
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default DeleteModal; 