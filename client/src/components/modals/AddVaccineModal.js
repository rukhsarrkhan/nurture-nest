import React, { useState } from 'react';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';


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

const AddModal = (props) => {

    const formatDate = (showdate) => {
        var year = showdate.substring(0, 4);
        var month = showdate.substring(5, 7);
        var day = showdate.substring(8, 10);
        return month + '/' + day + '/' + year;
    };

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [doses, setDoses] = useState(0);
    const [nameError, setnameError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [dosesError, setDosesError] = useState(false);




    const handleSubmit = async () => {
        if (name === '') {
            setnameError(true);
        }
        if (date === '') {
            setDateError(true);
        }
        if (doses === '') {
            setDosesError(true);
        }

        if (name && date && doses) {
            const data = {
                name: name,
                date: formatDate(date),
                doses: doses
            };
            await props.addVaccine(data)
        }
    }


    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p >
                        Add Vaccine
                    </p>
                    <form autoComplete="off" className="sign-form">
                        <TextField
                            className="formField"
                            label="Name"
                            onChange={e => setName(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            sx={{ mb: 1 }}
                            // fullWidth
                            value={name}
                            error={nameError}
                        />
                        <TextField
                            className="formField"
                            label="Date"
                            type='date'
                            onChange={e => setDate(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            sx={{ mb: 3 }}
                            // fullWidth
                            value={date}
                            error={dateError}
                        />
                        <TextField
                            className="formField"
                            label="Doses"
                            onChange={e => setDoses(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            sx={{ mb: 3 }}
                            // fullWidth
                            value={doses}
                            error={dosesError}
                        />
                        <Button variant="outlined" color="secondary" type="submit" onClick={() => handleSubmit()}>
                            Add
                        </Button>
                        <Button onClick={props.onClose}>
                            Close
                        </Button>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default AddModal;

