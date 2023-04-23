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

const AddAppointmentModal = (props) => {

    const formatDate = (showdate) => {
        var year = showdate.substring(0, 4);
        var month = showdate.substring(5, 7);
        var day = showdate.substring(8, 10);
        return month + '/' + day + '/' + year;
    };

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
    const [time, setTime] = useState(0);
    const [doctorError, setDoctorError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [hospitalErorr, setHospitalError] = useState(false);

    const handleSubmit = async () => {

        if (doctor === '') {
            setDoctorError(true);
        }
        if (hospital === '') {
            setHospitalError(true);
        }
        if (date === '') {
            setDateError(true);
        }
        if (time === '') {
            setTimeError(true);
        }
        if (doctor && hospital && date && time) {
            const data = {
              doctor: doctor,
              hospital: hospital,
              date: formatDate(date),
              time: tConvert(time)
            };
            await props.addAppointment(data)
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
                    <TextField
                        className="formField"
                        label="Name"
                        onChange={e => setDoctor(e.target.value)}
                        required
                        variant="outlined"
                        color="secondary"
                        sx={{ mb: 1 }}
                        // fullWidth
                        value={doctor}
                        error={doctorError}
                    />
                    <TextField
                        className="formField"
                        label="Name"
                        onChange={e => setHospital(e.target.value)}
                        required
                        variant="outlined"
                        color="secondary"
                        sx={{ mb: 1 }}
                        // fullWidth
                        value={hospital}
                        error={hospitalErorr}
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
                        type='time'
                        onChange={e => setTime(e.target.value)}
                        required
                        variant="outlined"
                        color="secondary"
                        sx={{ mb: 3 }}
                        // fullWidth
                        value={time}
                        error={timeError}
                    />
                    <Button variant="outlined" color="secondary" type="submit" onClick={() => handleSubmit()}>
                        Add
                    </Button>
                    <Button onClick={props.onClose}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};


export default AddAppointmentModal; 