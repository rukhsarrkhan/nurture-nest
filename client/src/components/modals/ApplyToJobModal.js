import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { createJobAPICall } from "../redux/jobs/jobActions";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";
import helpers from "../../helpers";
import allStates from "../../allStates";

const ApplyToJobModal = (props) => {
    const [errorText, setErrorText] = useState("");
    const [nannyName, setNannyName] = useState("");
    const [nannyNameError, setnannyNameError] = useState(false);
    const [contact, setContact] = useState("");
    const [contactError, setContactError] = useState(false);
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState(false);
    const [city, setCity] = useState("");
    const [cityError, setCityError] = useState(false);
    const [state, setState] = useState("");
    const [stateError, setStateError] = useState(false);
    const [zipCode, setZipCode] = useState("");
    const [zipCodeError, setZipCodeError] = useState(false);
    const [distance, setDistance] = useState("");
    const [distanceError, setDistanceError] = useState(false);
    const [shift, setShift] = React.useState("");
    const [shiftError, setShiftError] = useState(false);
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [disability, setDisability] = useState("");
    const [disabilityError, setDisabilityError] = useState(false);
    const [experience, setExperience] = useState("");
    const [experienceError, setExperienceError] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [coverLetterError, setCoverLetterError] = useState(false);

    const validation = async (field, valFunc) => {
        let fieldVal = await helpers.execValdnAndTrim(field);
        let check = await valFunc;
        if (check && check.statusCode === 400) {
            return check.message;
        } else {
            return "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorText("");
        setnannyNameError(false);
        setContactError(false);
        setAddressError(false);
        setCityError(false);
        setStateError(false);
        setZipCodeError(false);
        setDistanceError(false);
        setShiftError(false);
        setDescriptionError(false);
        setDisabilityError(false);
        setExperienceError(false);
        setCoverLetterError(false);

        let nannyNameChec = await validation(nannyName, helpers.isNameValid(nannyName, "Nanny Name"));
        if (nannyNameChec !== "") {
            setNannyName(true);
            setErrorText(nannyNameChec);
            return;
        }

        let contactChec = await validation(contact, helpers.validatePhoneNumber(contact, "Phone Number"));
        if (contactChec !== "") {
            setContactError(true);
            setErrorText(contactChec);
            return;
        }

        let addressChec = await validation(address, helpers.isAddressParentValid(address, "Address"));
        if (addressChec !== "") {
            setAddressError(true);
            setErrorText(addressChec);
            return;
        }
        if (address === "") {
            setAddressError(true);
        }

        let cityChec = await validation(city, helpers.isCityParentValid(city, "City"));
        if (cityChec !== "") {
            setCityError(true);
            setErrorText(cityChec);
            return;
        }

        let stateChec = await validation(state, helpers.isStateParentValid(state, "State"));
        if (stateChec !== "") {
            setStateError(true);
            setErrorText(stateChec);
            return;
        }

        let zipCodeChec = await validation(zipCode, helpers.isZipCodeParentValid(zipCode, "ZipCode"));
        if (zipCodeChec !== "") {
            setZipCodeError(true);
            setErrorText(zipCodeChec);
            return;
        }

        let distanceChec = await validation(distance, helpers.isDistanceInputValid(distance, "Distance from Job"));
        if (distanceChec !== "") {
            setDistanceError(true);
            setErrorText(distanceChec);
            return;
        }

        if (distance > 100) {
            setDistanceError(true);
            setErrorText("Maximum distance can be 100 miles or lower");
            return;
        }

        if (shift) {
            setShift(shift.trim());
        }
        if (description) {
            setDescription(description.trim());
        }
        if (disability) {
            setDisability(disability.trim());
        }
        if (experience) {
            setExperience(experience.trim());
        }
        if (coverLetter) {
            setCoverLetter(coverLetter.trim());
        }

        if (nannyName && contact && address && city && state && zipCode && distance) {
            const data = {
                nannyName: nannyName,
                contact: contact,
                nannyAddress: address,
                city: city,
                state: state,
                zipCode: zipCode,
                distance: distance,
                shiftPuntuality: shift,
                whySelect: description,
                disability: disability,
                experience: experience,
                attachment: coverLetter,
            };
            props.applyToJob(data, props.nannyId, props.jobId);
        }
    };

    return (
        <React.Fragment>
            <div className="container" sx={{ display: "flex", flexWrap: "wrap" }}>
                <Modal
                    sx={{ overflow: "scroll" }}
                    open={props.open}
                    onClose={props.onClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
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
                            borderRadius: "100px",
                        }}
                    >
                        <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
                            <Typography id="modal-modal-title" variant="h1" color="secondary">
                                Apply
                            </Typography>

                            {/* {checkboxErrorText && <Typography variant="subtitle1">Select atleast 1 day for shifts</Typography>} */}

                            <TextField
                                className="formField"
                                label="Nanny Name"
                                onChange={(e) => setNannyName(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3, mr: 2 }}
                                // fullWidth
                                helperText={nannyNameError && errorText}
                                value={nannyName}
                                error={nannyNameError}
                            />
                            <TextField
                                className="formField"
                                label="Contact Number"
                                onChange={(e) => setContact(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3, mr: 2 }}
                                // fullWidth
                                helperText={contactError && errorText}
                                value={contact}
                                error={contactError}
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
                                className="formField"
                                label="City"
                                onChange={(e) => setCity(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3, mr: 2 }}
                                // fullWidth
                                helperText={cityError && errorText}
                                value={city}
                                error={cityError}
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
                                sx={{ mb: 1 }}
                            >
                                {allStates.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                className="formField"
                                label="ZipCode"
                                onChange={(e) => setZipCode(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={zipCodeError && errorText}
                                value={zipCode}
                                error={zipCodeError}
                            />
                            <TextField
                                className="formField"
                                label="How far do you stay? (Mention in miles)"
                                onChange={(e) => setDistance(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={distanceError && errorText}
                                value={distance}
                                error={distanceError}
                            />
                            <TextField
                                className="formField"
                                label="Will you be able to follow shift timings punctiually?If you want to mention something then do so"
                                onChange={(e) => setShift(e.target.value)}
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={shiftError && errorText}
                                value={shift}
                                error={shiftError}
                            />
                            <TextField
                                className="formField"
                                label="Describe why should you be selected"
                                onChange={(e) => setDescription(e.target.value)}
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={descriptionError && errorText}
                                value={description}
                                error={descriptionError}
                            />
                            <TextField
                                className="formField"
                                label="Do you have any disability? If yes then mention about it"
                                onChange={(e) => setDisability(e.target.value)}
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={disabilityError && errorText}
                                value={disability}
                                error={disabilityError}
                            />
                            <TextField
                                className="formField"
                                label="Previous Experience"
                                onChange={(e) => setExperience(e.target.value)}
                                multiline
                                rows={1}
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={experienceError && errorText}
                                value={experience}
                                error={experienceError}
                            />
                            <TextField
                                className="formField"
                                label="Paste your Cover letter here"
                                onChange={(e) => setCoverLetter(e.target.value)}
                                multiline
                                rows={1}
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 1 }}
                                fullWidth
                                helperText={coverLetterError && errorText}
                                value={coverLetter}
                                error={coverLetterError}
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

export default ApplyToJobModal;
