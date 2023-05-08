import React, { useState } from 'react';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import helpers from '../../helpers';
import { Container } from '@mui/system';
import image from '../../img/MealPlan.jpg';

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
    borderRadius: '50px'
};

const AddMealModal = (props) => {
    const today = new Date().toISOString().slice(0, 16);

    const tConvert = (time) => {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    };

    const [meal, setMeal] = useState('');
    const [mealError, setMealError] = useState(false);
    const [time, setTime] = useState('');
    const [directions, setDirections] = useState('');
    const [timeError, setTimeError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMealError(false);
        setErrorText("");

        let MealCheck = await helpers.onlyLettersNumbersAndSpaces(meal, "Meal");
        if (MealCheck !== undefined) {
            setMealError(true);
            setErrorText(MealCheck.message);
            return;
        }

        if (time === '') {
            setTimeError(true);
        }
        if (meal?.trim() && time?.trim() && errorText === "") {
            try {
                const data = {
                    meal: meal,
                    time: tConvert(time),
                    directions: directions
                };
                await props?.addMeal(data);
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <div >
            <Modal
                open={props?.open}
                onClose={props?.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container maxWidth="sm">
                    <Box className='appointmentForm' sx={style} >
                        <img
                            src={image}
                            alt="appointment description"
                            className='vaccine-image'
                        />
                        <p className='P-title-home' >
                            Add Meal
                        </p>

                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <TextField
                                className="mealField"
                                label="Meal"
                                onChange={e => setMeal(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={mealError && errorText}
                                value={meal}
                                error={mealError}
                            />

                            <TextField
                                className="mealField"
                                label="Directions"
                                onChange={e => setDirections(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                // fullWidth
                                value={directions}
                                multiline
                                rows={5}
                            />
                            <TextField
                                id="inline-picker"
                                className="mealField"
                                type='time'
                                label="Time"
                                onChange={e => setTime(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={timeError && errorText}
                                value={time}
                                error={timeError}
                            />

                            <Button variant="outlined" color="secondary" type="submit" >
                                Add
                            </Button>
                            <Button onClick={props?.onClose}>
                                Close
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Modal>
        </div>
    );
};


export default AddMealModal;
