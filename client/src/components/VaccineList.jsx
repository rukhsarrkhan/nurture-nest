import React,{useState} from 'react';
import '../App.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,  { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField} from "@mui/material";
import { connect } from 'react-redux';
import { vaccineDataAPICall } from '../redux/vaccines/vaccineActions';



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

function createData(
  name,
  date,
  doses
) {
  return { name, date, doses };
}
const rows = [
  createData('Chickenpox', '03/04/2020', 1),
  createData('Haemophilus influenzae type b (Hib)', '03/04/2020' , 1),
  createData('Polio (IPV) (between 6 through 18 months)','03/04/2020', 1),
  createData('Pneumococcal (PCV)','03/04/2020', 1),
  createData('Hepatitis A','03/04/2020',1),
];


const VaccineList = ({ vaccineData, vaccineDataAPICall} ) => {
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [doses, setDoses] = useState(0);
  const [nameError, setnameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [dosesError, setDosesError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  const addVaccine = (event) =>{
    event.preventDefault();
    const newVaccine = createData(name,date,doses)
    rows.push(newVaccine);
    setOpen(false)
    setnameError(false)
    setDateError(false)
    setDosesError(false)

    if (name === '') {
      setnameError(true);
    }
    if (date === '') {
      setDateError(true);
    }
    if (doses === '') {
      setDosesError(true);
    }

    if(name && date && doses){
      const data = {
        name: name,
        date: date,
        doses: doses
      };
      vaccineDataAPICall(data)
    }
  }
  

  return (
    <div className="container" >
   <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Vaccines</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Doses</StyledTableCell>
            {/* <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.date}</StyledTableCell>
              <StyledTableCell align="right">{row.doses}</StyledTableCell>
              {/* <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <button onClick={handleOpen}>Add Vaccine</button>
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <p >
      Add Vaccine
    </p>
    <form autoComplete="off" onSubmit={addVaccine} className="sign-form">
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
         <Button variant="outlined" color="secondary" type="submit" onClick={addVaccine}>
          Add
        </Button>
        <Button  onClick={handleClose}>
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
    vaccineData: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    vaccineDataAPICall: (obj) => dispatch(vaccineDataAPICall(obj))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VaccineList);