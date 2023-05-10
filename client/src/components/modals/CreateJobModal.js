import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";
import helpers from "../../helpers";
import allStates from "../../allStates";
import { Container } from '@mui/system';

const CreateJobModal = (props) => {
  //  CONSOLE ERRORS
  const [errorText, setErrorText] = useState("");
  const [specialCare, setSpecialCare] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [salary, setSalary] = useState("");
  const [shift, setShift] = React.useState("");
  const [daysError, setDaysError] = useState(false);
  const [shiftError, setShiftError] = useState(false);
  const [specialCareError, setSpecialCareError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const [checkboxErrorText, setCheckboxErrorText] = useState("");

  const [monday, setMonday] = React.useState(false);
  const [tuesday, setTuesday] = React.useState(false);
  const [wednesday, setWednesday] = React.useState(false);
  const [thursday, setThursday] = React.useState(false);
  const [friday, setFriday] = React.useState(false);
  const [saturday, setSaturday] = React.useState(false);
  const [sunday, setSunday] = React.useState(false);

  const validation = async (field, valFunc) => {
    await helpers.execValdnAndTrim(field);
    let check = await valFunc;
    if (check && check.statusCode === 400) {
      return check.message;
    } else {
      return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let timeFrom = shift[0].toLocaleString();
    let timeTo = shift[1].toLocaleString();
    // const date = new Date(shift[0].toLocaleString());
    // const timeString = date.toLocaleString("en-US", {timeZone: "America/New_York",timeZoneName: "short"});
    // const hours = date.getUTCHours(); // Returns the hours component of the timestamp (in UTC)
    // const mins = date.getUTCMinutes(); // Returns the minutes component of the timestamp (in UTC)

    setShiftError(false);
    setDaysError(false);
    setSpecialCareError(false);
    setDescriptionError(false);
    setAddressError(false);
    setStateError(false);
    setZipCodeError(false);
    setSalaryError(false);
    setErrorText("");
    setCheckboxErrorText("");

    let shiftFromChec = await validation(
      timeFrom,
      helpers.isDateValid(timeFrom, "Shift Timing from")
    );
    if (shiftFromChec !== "") {
      setShiftError(true);
      setErrorText(shiftFromChec);
      return;
    }
    let shiftToChec = await validation(
      timeTo,
      helpers.isDateValid(timeTo, "Shift Timing to")
    );
    if (shiftToChec !== "") {
      setShiftError(true);
      setErrorText(shiftToChec);
      return;
    }
    // let shiftTimingsCheck = await helpers.isTime1BeforeTime2(timeFrom, timeTo);
    // if (shiftTimingsCheck !== "") {
    //   setShiftError(true);
    //   setErrorText(shiftTimingsCheck.message);
    //   return;
    // }

    let days = [];
    if (monday) days.push("Monday");
    if (tuesday) days.push("Tuesday");
    if (wednesday) days.push("Wednesday");
    if (thursday) days.push("Thursday");
    if (friday) days.push("Friday");
    if (saturday) days.push("Saturday");
    if (sunday) days.push("Sunday");
    if (days.length === 0) {
      setDaysError(true);
      setErrorText(`Atleast one day should be selected for nanny shifts.`);
      setCheckboxErrorText(
        "Atleast one day should be selected for nanny shifts."
      );
      return;
    }

    let shiftLimitCheck = await helpers.isShiftLimitValid(
      timeFrom,
      timeTo,
      days.length
    );
    if (shiftLimitCheck !== "") {
      setShiftError(true);
      setErrorText(shiftLimitCheck.message);
      return;
    }

    let specialCareChec = await validation(
      specialCare,
      helpers.isSpecialcareParentValid(specialCare, "SpecialCare")
    );
    if (specialCareChec !== "") {
      setSpecialCareError(true);
      setErrorText(specialCareChec);
      return;
    }

    let descriptionChec = await validation(
      description,
      helpers.isDescriptionParentValid(description, "Description")
    );
    if (descriptionChec !== "") {
      setDescriptionError(true);
      setErrorText(descriptionChec);
      return;
    }
    if (description === "") {
      setDescriptionError(true);
    }

    let addressChec = await validation(
      address,
      helpers.isAddressParentValid(address, "Address")
    );
    if (addressChec !== "") {
      setAddressError(true);
      setErrorText(addressChec);
      return;
    }
    if (address === "") {
      setAddressError(true);
    }

    let stateChec = await validation(
      state,
      helpers.isStateParentValid(state, "State")
    );
    if (stateChec !== "") {
      setStateError(true);
      setErrorText(stateChec);
      return;
    }

    let zipCodeChec = await validation(
      zipCode,
      helpers.isZipCodeParentValid(zipCode, "ZipCode")
    );
    if (zipCodeChec !== "") {
      setZipCodeError(true);
      setErrorText(zipCodeChec);
      return;
    }

    let salaryChec = await validation(
      salary,
      helpers.isSalaryParentValid(salary, "Salary")
    );
    if (salaryChec !== "") {
      setSalaryError(true);
      setErrorText(salaryChec);
      return;
    }
    if (salary === "") {
      setSalaryError(true);
    }

    if (
      shift[0] &&
      shift[1] &&
      specialCare &&
      description &&
      address &&
      state &&
      zipCode &&
      salary
    ) {
      const data = {
        shifts: { timeFrom: shift[0], timeTo: shift[1], days: days },
        specialCare: specialCare,
        description: description,
        address: address,
        state: state,
        zipCode: zipCode,
        salary: salary,
      };

      props.createJob(data, props.parentId, props.childId);
    }
  };

  return (
    // <React.Fragment>
    <div className="container">
      <Modal
        sx={{ overflow: "scroll" }}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 670,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              borderRadius: '100px',
              // marginTop: "-10px"
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
                <DemoContainer
                  components={[
                    "SingleInputTimeRangeField",
                    "SingleInputTimeRangeField",
                  ]}
                >
                  <SingleInputTimeRangeField
                    className="formField"
                    variant="filled"
                    required
                    color="secondary"
                    label="Shift Timing"
                    value={shift}
                    fullWidth
                    onChange={(newValue) => setShift(newValue)}
                    helperText={shiftError && errorText?errorText:"Shift hours can be minimum 2hrs to maximum 40 hrs per week"}
                    error={shiftError}
                  />
                </DemoContainer>
              </LocalizationProvider>

              {checkboxErrorText && (
                <Typography variant="subtitle1">
                  Select atleast 1 day for shifts
                </Typography>
              )}
              <FormControl
                required
                error={daysError}
                helperText={daysError && errorText}
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend" color="secondary">
                  Pick Shift Days
                </FormLabel>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={monday}
                        onChange={(event) => setMonday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Monday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={tuesday}
                        onChange={(event) => setTuesday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Tuesday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={wednesday}
                        onChange={(event) => setWednesday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Wednesday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={thursday}
                        onChange={(event) => setThursday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Thursday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={friday}
                        onChange={(event) => setFriday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Friday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={saturday}
                        onChange={(event) => setSaturday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Saturday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={sunday}
                        onChange={(event) => setSunday(event.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Sunday"
                    sx={{
                      color: pink[800],
                      "&.Mui-checked": { color: pink[600] },
                    }}
                  />
                </FormGroup>
              </FormControl>
              <br />
              <TextField
                className="formField"
                label="SpecialCare"
                onChange={(e) => setSpecialCare(e.target.value)}
                required
                variant="filled"
                color="secondary"
                sx={{ mb: 1 }}
                fullWidth
                helperText={specialCareError && errorText}
                value={specialCare}
                error={specialCareError}
              />
              <TextField
                className="formField"
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="filled"
                color="secondary"
                multiline
                rows={1}
                sx={{ mb: 1 }}
                fullWidth
                helperText={descriptionError && errorText}
                value={description}
                error={descriptionError}
              />
              <TextField
                className="formField"
                label="Address"
                onChange={(e) => setAddress(e.target.value)}
                required
                variant="filled"
                color="secondary"
                sx={{ mb: 3, mr: 2 }}
                // fullWidth
                helperText={addressError && errorText}
                value={address}
                error={addressError}
              />
              <TextField
                label="State"
                defaultValue=""
                select
                required
                onChange={(e) => setState(e.target.value)}
                variant="filled"
                color="secondary"
                helperText={stateError ? errorText : "Please select State"}
                value={state}
                error={stateError}
                // fullWidth
                sx={{ mb: 3, mr: 2 }}
              >
                {allStates.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className="formField"
                label="Zip Code"
                onChange={(e) => setZipCode(e.target.value)}
                required
                variant="filled"
                color="secondary"
                //sx={{ mb: 1}}
                // fullWidth
                helperText={zipCodeError && errorText}
                value={zipCode}
                error={zipCodeError}
              />
              <TextField
                className="formField"
                label="Salary in USD per hour"
                onChange={(e) => setSalary(e.target.value)}
                required
                variant="filled"
                color="secondary"
                sx={{ mb: 1 }}
                fullWidth
                helperText={salaryError && errorText}
                value={salary}
                error={salaryError}
              />
              <Button variant="outlined" color="secondary" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </Container>
      </Modal>
    </div>
    // </React.Fragment>
  );
};

export default CreateJobModal;
