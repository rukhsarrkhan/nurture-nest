import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createJobAPICall } from "../redux/jobs/jobActions";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";

const CreateJob = ({ jobData, userRegistrationAPICall }) => {
  const { job } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  // Modal states
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Form vars
  const [mondayShift, setMondayShift] = useState("");
  const [tuesdayShift, setTuesdayShift] = useState("");
  const [wednesdayShift, setWednesdayShift] = useState("");
  const [thursdayShift, setThursdayShift] = useState("");
  const [fridayShift, setFridayShift] = useState("");
  const [saturdayShift, setSaturdayShift] = useState("");
  const [sundayShift, setSundayShift] = useState("");
  // Non shift vars
  const [specialCare, setSpecialCare] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [specialCareError, setSpecialCareError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);

  const handleSubmit = (event) => {
    console.log("event mondayShift", mondayShift);
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
                <DemoContainer components={["SingleInputTimeRangeField"]}>
                  {/* <Typography
                    id="modal-modal-description"
                    variant="h5"
                    sx={{ mt: 2, color: "text.primary" }}
                  >
                    {" "}
                    Monday{" "}
                  </Typography>
                  <SingleInputTimeRangeField
                    label="From - To"
                    onChange={(e) =>
                      e[0] && e[0].$H && e[1] && e[1].$H
                        ? setMondayShift({
                            startHr: e[0].$H,
                            startMin: e[0].$m,
                            endHr: e[1].$H,
                            endMin: e[1].$m,
                          })
                        : ""
                    }
                  /> */}
                  {/* <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Tuesday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setTuesdayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} />
            <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Wednesday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setWednesdayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} />
            <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Thursday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setThursdayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} />
            <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Friday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setFridayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} />
            <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Saturday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setSaturdayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} />
            <Typography id="modal-modal-description" variant="h5" sx={{ mt: 2,color: 'text.primary' }}> Sunday </Typography>
            <SingleInputTimeRangeField label="From - To" onChange={e => setSundayShift({startHr:e[0].$H,startMin:e[0].$m,endHr:e[1].$H,endMin:e[1].$m})} /> */}
                </DemoContainer>
              </LocalizationProvider>
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
