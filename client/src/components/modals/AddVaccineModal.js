import React, { useState } from 'react';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import helpers from '../../helpers';
import {useNavigate} from 'react-router-dom';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
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
    const [doses, setDoses] = useState('');
    const [nameError, setnameError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [dosesError, setDosesError] = useState(false);
    const [errorText, setErrorText] = useState("");
    let navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault();

        setnameError(false);
        setDateError(false);
        setDosesError(false);
        setErrorText("")

        let nameCheck = await helpers.onlyLettersNumbersAndSpaces(name,"name")
        if (nameCheck !== undefined) {
            setnameError(true);
            setErrorText(nameCheck.message)
            return;
        }
        let dateCheck = await helpers.isDateValid(date,"date")
        if (dateCheck !== undefined) {
            setDateError(true);
            setErrorText(dateCheck.message)
            return
        }
        let dosesCheck = await helpers.onlyNumbers(doses,"doses")
        if (dosesCheck !==undefined) {
            setDosesError(true);
            setErrorText(dosesCheck.message)
            return
        }

        if (name.trim() && date.trim() && doses.trim() && errorText === "") {
            try{
            const data = {
                name: name,
                date: formatDate(date),
                doses: doses
            };
            await props.addVaccine(data)
        } catch (error){
            alert(error)
        }
        }
        navigate(`/vaccine/${props.childId}`)
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
                    <p className='P-title-home' >
                        Add Vaccine
                    </p>
                    <form autoComplete="off" className="sign-form" onSubmit={handleSubmit}>
                        <TextField
                            className="formField"
                            label="Name"
                            onChange={e => setName(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            sx={{ mb: 1 }}
                            helperText={nameError && errorText}
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
                            helperText={dateError && errorText}
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
                            helperText={dosesError && errorText}
                            value={doses}
                            error={dosesError}
                        />
                        <Button variant="outlined" color="secondary" type="submit">
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

