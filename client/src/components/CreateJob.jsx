import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createJobAPICall } from "../redux/jobs/jobActions";
import Modal from "@mui/material/Modal";
import dayjs from 'dayjs';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';


const CreateJob = ({ jobData, userRegistrationAPICall }) => {
  const { job } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  // Modal states
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Form vars

  // Non shift vars
  const [specialCare, setSpecialCare] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [specialCareError, setSpecialCareError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const [value, setValue] = React.useState();
  const [monday, setMonday] = React.useState(false);
  const [tuesday, setTuesday] = React.useState(false);
  const [wednesday, setWednesday] = React.useState(false);
  const [thursday, setThursday] = React.useState(false);
  const [friday, setFriday] = React.useState(false);
  const [saturday, setSaturday] = React.useState(false);
  const [sunday, setSunday] = React.useState(false);




  const handleSubmit = (event) => {
    console.log(value.toLocaleString(),"halloooo")
    event.preventDefault();

    setSpecialCareError(false);
    setDescriptionError(false);
    setAddressError(false);
    setSalaryError(false);

    if (specialCare === "") {
      setSpecialCareError(true);
    }
    if (description === "") {
      setDescriptionError(true);
    }
    if (address === "") {
      setAddressError(true);
    }
    if (salary === "") {
      setSalaryError(true);
    }

    if (specialCare && description && address && salary) {
      const data = {
        specialCare: specialCare,
        description: description,
        address: address,
        salary: salary,
      };
      dispatch(createJobAPICall(data));
    }
  };

  

  return (
    <React.Fragment>
      <div className="container">
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          sx={{ overflow: "scroll" }}
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              className="sign-form"
            >
              <Typography id="modal-modal-title" variant="h2" color="secondary">
                Create Job
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['SingleInputTimeRangeField', 'SingleInputTimeRangeField']} >
                    <SingleInputTimeRangeField required color="secondary" label="Shift Timing" value={value} onChange={(newValue) => setValue(newValue)} />
                  </DemoContainer>
              </LocalizationProvider>
              <br />
              <FormGroup>
                <FormControlLabel control={<Checkbox color="secondary" checked={monday} onChange={(event) => setMonday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Monday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={tuesday} onChange={(event) => setTuesday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Tuesday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={wednesday} onChange={(event) => setWednesday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Wednesday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={thursday} onChange={(event) => setThursday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Thursdy" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={friday} onChange={(event) => setFriday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Friday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={saturday} onChange={(event) => setSaturday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Saturday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
                <FormControlLabel control={<Checkbox color="secondary" checked={sunday} onChange={(event) => setSunday(event.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Sunday" sx={{color: pink[800], '&.Mui-checked': {color: pink[600],},}} />
              </FormGroup>
              <br />
              <TextField
                className="formField"
                label="SpecialCare"
                onChange={(e) => setSpecialCare(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                value={specialCare}
                error={specialCareError}
              />
              <TextField
                className="formField"
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                value={description}
                error={descriptionError}
              />
              <TextField
                className="formField"
                label="Address"
                onChange={(e) => setAddress(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                value={address}
                error={addressError}
              />
              <TextField
                className="formField"
                label="Salary"
                onChange={(e) => setSalary(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                value={salary}
                error={salaryError}
              />
              <Button variant="outlined" color="secondary" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
    </React.Fragment>
  );
};

// const mapStateToProps = state => {
//     return { jobData: state };
//   };

// const mapDispatchToProps = dispatch => {
//     return { createJobAPICall: (obj) => dispatch(createJobAPICall(obj)) };
// };

// export default connect( mapStateToProps, mapDispatchToProps )( CreateJob );

export default CreateJob;
