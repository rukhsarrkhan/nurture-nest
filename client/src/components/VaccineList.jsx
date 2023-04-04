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
import Typography from '@mui/material/Typography';


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


const VaccineList = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [doses, setDoses] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addVaccine = () =>{
    const newVaccine = createData(name,date,doses)
    rows.push(newVaccine);
    setOpen(false)
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
  // aria-labelledby="modal-modal-title"
  // aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography >
      Add Vaccine
    </Typography>

    <Typography>
          Name
        </Typography>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
     <Typography >
          Date
        </Typography>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
          <Typography>
          Doses
        </Typography>
        <input
          type="number"
          value={doses}
          onChange={(e) => setDoses(e.target.value)}
        />
         <Button  onClick={addVaccine}>
          Add
        </Button>
        <Button  onClick={handleClose}>
          Close
        </Button>
  </Box>
</Modal>
    </div>
);
};

export default VaccineList; 