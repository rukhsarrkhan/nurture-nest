import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

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

const SelectNanny = (props) => {

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
                        Are you sure you want to select Nanny:{props.nannyName} & Id:{props.nannyId} for your child?
                    </p>
                    <Button variant="outlined" color="secondary" type="submit" onClick={() => props.selectNanny(props.jobId,props.nannyId)}>
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

export default SelectNanny; 