import React, { useEffect, useState }from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAppointmentAPICall } from '../redux/appointments/appointmentActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import '../App.css';
import { appointmentSetAPICall } from '../redux/appointments/appointmentActions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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

const AppointmentList = ({ getAppointmentAPICall,appointmentSetAPICall, appointmentData }) => {
  let { childId } = useParams();

  const [open, setOpen] = useState(false);
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(0);
  const [doctorError, setDoctorError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [hospitalErorr, setHospitalError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getAppointmentAPICall(childId);
  }, []);


  const addAppointment = async (event) => {
    event.preventDefault();
    setOpen(false)
    setDoctorError(false)
    setHospitalError(false)
    setDateError(false)
    setTimeError(false)

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
        date: date,
        time: time
      };
      await appointmentSetAPICall(data, childId)
    }
  }


  return (
    <div className="container" >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Doctor</StyledTableCell>
              <StyledTableCell align="right">Hospital</StyledTableCell>
              <StyledTableCell align="right">Date</StyledTableCell>
              <StyledTableCell align="right">Time</StyledTableCell>
              {/* <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointmentData.data && appointmentData.data.map((row) => (
              <StyledTableRow key={row.doctor}>
                <StyledTableCell component="th" scope="row"> {row.doctor}</StyledTableCell>
                <StyledTableCell align="right">{row.hospital}</StyledTableCell>
                <StyledTableCell align="right">{row.date}</StyledTableCell>
                <StyledTableCell align="right">{row.time}</StyledTableCell>
                {/* <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <button onClick={handleOpen}>Add Appointment</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p >
            Add Appointment
          </p>
          <form autoComplete="off" onSubmit={addAppointment} className="sign-form">
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
              onChange={e => setTime(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              sx={{ mb: 3 }}
              // fullWidth
              value={time}
              error={timeError}
            />
            <Button variant="outlined" color="secondary" type="submit" onClick={addAppointment}>
              Add
            </Button>
            <Button onClick={handleClose}>
              Close
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userData: state.users,
    appointmentData: state.appointments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAppointmentAPICall: (childId) => dispatch(getAppointmentAPICall(childId)),
    appointmentSetAPICall: (obj,childId) => dispatch(appointmentSetAPICall(obj,childId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentList);