import React, { useState } from "react";
import { Typography, Avatar, Button, TextField, Box, Modal, MenuItem } from "@mui/material";
import helpers from "../../helpers";
import { Container } from "@mui/system";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "50px",
};

const sexes = [
    {
        value: "Male",
        label: "Male",
    },
    {
        value: "Female",
        label: "Female",
    },
    {
        value: "Non-Binary",
        label: "Non-Binary",
    },
    {
        value: "Transgender",
        label: "Transgender",
    },
    {
        value: "Other",
        label: "Other",
    },
];

const AddChildModal = (props) => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");

    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [disableBtn, setdisableBtn] = useState(false);

    const [nameError, setNameError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [sexError, setSexError] = useState(false);
    const [imageError, setImageError] = useState(null);

    const [errorText, setErrorText] = useState("");
    const validSexArr = ["Male", "Female", "Non-Binary", "Transgender", "Other"];

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 1000000) {
                setImageError("File size should not exceed 1 MB.");
                setImagePreview(null);
            } else {
                setImagePreview(URL.createObjectURL(file));
                setImageFile(file);
                setImage(null);
                setImageError(null);
            }
        } else {
            setImagePreview(null);
            setImageError(null);
        }
    };

    const validation = async (field, valFunc) => {
        //need to change valdn function.. it'll fail if str is empty spaces.
        let fieldVal = await helpers.execValdnAndTrim(field);
        let check = "";
        if (valFunc) {
            check = await valFunc;
        }
        if (fieldVal && fieldVal.statusCode === 400) {
            return fieldVal.message;
        } else if (check && check.statusCode === 400) {
            return check.message;
        } else {
            return "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setdisableBtn(true);
        setNameError(false);
        setAgeError(false);
        setSexError(false);
        setErrorText("");

        let nameCheck = await validation(name, helpers.isNameValid(name, "Name"));
        if (nameCheck !== "") {
            setNameError(true);
            setErrorText(nameCheck);
            setdisableBtn(false);
            return;
        }

        let ageCheck = await validation(age, helpers.isChildAgeValid(age, props.parentAge));
        if (ageCheck !== "") {
            setAgeError(true);
            setErrorText(ageCheck);
            setdisableBtn(false);
            return;
        }
        if (!validSexArr.includes(sex)) {
            setSexError(true);
            setErrorText("Invalid sex provided");
            setdisableBtn(false);
            return;
        }
        if (!imageFile) {
            setImageError("No image available");
            setImagePreview(null);
            setdisableBtn(false);
            return;
        }

        if (name.trim() && age.trim() && sex.trim() && imageFile && errorText === "") {
            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("name", name);
            formData.append("age", age);
            formData.append("sex", sex);
            formData.append("parentId", props.parentId);
            try {
                await props.addChild(formData);
            } catch (error) {
                console.log(error);
                setdisableBtn(false);
            }
            setdisableBtn(false);
        }
    };

    return (
        <div>
            <Modal open={props?.open} onClose={props?.onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Container maxWidth="sm">
                    <Box className="appointmentForm" sx={style}>
                        <p className="P-title-home">Add Child</p>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {image ? (
                                    <Avatar src={image} alt="Selected Image" sx={{ width: 200, height: 200 }} variant="circular" />
                                ) : imagePreview ? (
                                    <Avatar src={imagePreview} alt="Selected Image" sx={{ width: 200, height: 200 }} variant="circular" />
                                ) : (
                                    <Avatar alt="Selected Image" sx={{ width: 200, height: 200 }} variant="circular" />
                                )}

                                <input type="file" onChange={handleImageChange} accept="image/*" required />
                                {imageError && <Typography color="error">{imageError}</Typography>}
                            </Box>
                            <TextField
                                className="appointmentField"
                                label="Name"
                                onChange={(e) => setName(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={nameError && errorText}
                                value={name}
                                error={nameError}
                            />
                            <TextField
                                className="appointmentField"
                                label="Age"
                                onChange={(e) => setAge(e.target.value)}
                                required
                                variant="filled"
                                color="secondary"
                                sx={{ mb: 3 }}
                                helperText={ageError && errorText}
                                value={age}
                                error={ageError}
                            />
                            <TextField
                                label="Sex"
                                defaultValue="Male"
                                select
                                onChange={(e) => setSex(e.target.value)}
                                variant="filled"
                                color="secondary"
                                helperText={sexError ? errorText : "Please select your sex"}
                                value={sex}
                                error={sexError}
                                sx={{ textAlign: "left" }}
                                fullWidth
                            >
                                {sexes.map((option) => (
                                    <MenuItem key={option?.value} value={option?.value}>
                                        {option?.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button variant="outlined" color="secondary" type="submit" disabled={disableBtn}>
                                Add
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Modal>
        </div>
    );
};

export default AddChildModal;
