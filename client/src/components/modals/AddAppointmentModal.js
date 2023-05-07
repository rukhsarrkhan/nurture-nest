import React, { useState } from 'react';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import helpers from '../../helpers';
import { Container } from '@mui/system';
import image from '../../img/appointmentImage.png';

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

const AddAppointmentModal = (props) => {

    const formatDate = (showdate) => {
        var year = showdate.substring(0, 4);
        var month = showdate.substring(5, 7);
        var day = showdate.substring(8, 10);
        return month + '/' + day + '/' + year;
    };
    const today = new Date().toISOString().split('T')[0]; // get today's date in YYYY-MM-DD format


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

    const [doctor, setDoctor] = useState('');
    const [hospital, setHospital] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctorError, setDoctorError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [hospitalErorr, setHospitalError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDoctorError(false);
        setHospitalError(false);
        setDateError(false);
        setErrorText("");

        let doctorCheck = await helpers.isNameValid(doctor, "Doctor");
        if (doctorCheck !== undefined) {
            setDoctorError(true);
            setErrorText(doctorCheck.message);
            return;
        }
        let hospitalCheck = await helpers.isNameValid(hospital, "Hospital");
        if (hospitalCheck !== undefined) {
            setHospitalError(true);
            setErrorText(hospitalCheck.message);
            return;
        }
        if (date < today) {
            setDateError(true);
            setErrorText('Please select a future date');
            return;
        }
        if (doctor?.trim() && hospital?.trim() && date?.trim() && time?.trim() && errorText === "") {
            try {
                const data = {
                    doctor: doctor,
                    hospital: hospital,
                    date: formatDate(date),
                    time: tConvert(time)
                };
                await props?.addAppointment(data);
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
                            Add Appointment
                        </p>

                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <TextField
                                className="appointmentField"
                                label="Doctor"
                                onChange={e => setDoctor(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={doctorError && errorText}
                                value={doctor}
                                error={doctorError}
                            />
                            <TextField
                                className="appointmentField"
                                label="Hopital"
                                onChange={e => setHospital(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={hospitalErorr && errorText}
                                value={hospital}
                                error={hospitalErorr}
                            />
                            <TextField
                                className="appointmentField"
                                type='date'
                                onChange={e => setDate(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={dateError && errorText}
                                value={date}
                                error={dateError}
                            />
                            <TextField
                                id="inline-picker"
                                className="appointmentField"
                                label="Time"
                                type='time'
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


export default AddAppointmentModal; 
