import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { connect } from "react-redux";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import FireNannyModal from "./modals/FireNannyModal";
import { fireNannyAPICall } from "../redux/jobs/jobActions";

import { Card, CardMedia, Grid, CardActionArea, CardContent, Typography, Button } from "@mui/material";
import { getNannyDetailsAPICall } from "../redux/nannyDetails/nannyDetailsActions";

const NannyDetails = ({ getNannyDetailsAPICall, nannyData, jobData, fireNannyAPICall }) => {
    // PAGE BREAKING
    // NO CONSOLE ERRORS
    // LOADING MISSING
    // ERRORS MISSING
    // REMOVE PARAMS

    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [applicationdtls, setApplicationDtls] = useState(false);

    let { nannyId } = useParams();
    const location = useLocation();

    let navigate = useNavigate();
    let childData = location.state.childId;

    useEffect(() => {
        if (jobData) {
            // const applyDetails = jobData?.data?.applications?.find(obj => obj.nannyId === nannyId);
            // ^^ works in rukhsar's branch.. check why projection from query is diff
            const applyDetails = jobData?.applicantsData?.find((obj) => obj.nannyId === nannyId);
            setApplicationDtls(applyDetails);
        }
    }, [jobData]);

    useEffect(() => {
        async function fetchData() {
            try {
                getNannyDetailsAPICall(nannyId, childData);
                setLoading(false);
                setError(false);
            } catch (e) {
                setLoading(false);
                setError(true);
            }
        }
        if (childData !== undefined) {
            fetchData();
        }
    }, [childData]);

    useEffect(() => {
        // USE FOR HANDLING ERRORS
        if (nannyData !== undefined) {
        } else {
            console.log("hie");
        }
    }, [nannyData]);

    const handleOpen2 = (id) => {
        setDeleteId(id);
        setOpen2(true);
    };

    const handleClose2 = () => setOpen2(false);

    const fireNanny = async (childData) => {
        await fireNannyAPICall(childData, nannyId);
        setOpen2(false);
        navigate(-1);
    };

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    } else if (error) {
        return <div>Error here</div>;
    } else {
        return (
            <div>
                <br></br>
                <br></br>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate(-1);
                    }}
                    sx={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                    }}
                >
                    Back
                </Button>
                {nannyData.length !== 0 ? (
                    <div>
                        {nannyData._id && (
                            <Button
                                onClick={() => handleOpen2(childData)}
                                variant="contained"
                                color="error"
                                sx={{ marginTop: "2rem", marginRight: "auto", marginLeft: "0.5rem" }}
                            >
                                Fire Nanny
                            </Button>
                        )}

                        <br></br>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={7} md={5} lg={4} xl={6} key={nannyData?.firstName?.toString()}>
                                <Card sx={{ maxWidth: 600, borderRadius: 16 }}>
                                    <CardActionArea>
                                        <CardMedia component="img" height="200" alt="" image={nannyData?.photoUrl} />
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontFamily: "Arial, sans-serif",
                                                }}
                                            >
                                                Nanny Details
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontFamily: "Roboto, sans-serif",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {nannyData && nannyData.firstName && nannyData.lastName
                                                    ? "Name: " + nannyData?.firstName + " " + nannyData?.lastName
                                                    : "Name: No data to display"}
                                                <br />
                                                {applicationdtls && applicationdtls?.contact
                                                    ? "Contact: " + applicationdtls?.contact
                                                    : "Contact: No data to display"}
                                                <br />
                                                {applicationdtls && applicationdtls?.state
                                                    ? "State: " + applicationdtls?.state
                                                    : "State: No data to display"}
                                                <br />
                                                {applicationdtls && applicationdtls?.nannyAddress
                                                    ? "Address: " + applicationdtls?.nannyAddress
                                                    : "Address: No data to display"}
                                                <br />
                                                {applicationdtls && applicationdtls?.distance
                                                    ? "Distance: " + applicationdtls?.distance + " Miles"
                                                    : "Distance: No data to display"}
                                                <br />
                                                {applicationdtls && applicationdtls?.disability
                                                    ? "Disability: " + applicationdtls?.disability
                                                    : "No Disability"}
                                                <br />
                                                {applicationdtls && applicationdtls?.experience
                                                    ? "Experience: " + applicationdtls?.experience
                                                    : "No Experience"}
                                                <br />
                                                {applicationdtls && applicationdtls?.shiftPuntuality
                                                    ? "Punctuality: " + applicationdtls?.shiftPuntuality
                                                    : "No Punctuality details"}
                                                <br />
                                                {applicationdtls && applicationdtls?.attachment
                                                    ? "Attachments: " + applicationdtls?.attachment
                                                    : "No Attachments"}
                                                <br />
                                                {applicationdtls && applicationdtls?.whySelect
                                                    ? "Reason To Select: " + applicationdtls?.whySelect
                                                    : "Reason To Select: No data to display"}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    // THIS CAN BE HANDLED AS AN ERROR
                    <p>No details for this nanny </p>
                )}
                {open2 && (
                    <FireNannyModal
                        open={open2}
                        onClose={handleClose2}
                        _id={deleteId}
                        fireNanny={fireNanny}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />
                )}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        nannyData: state?.nanny?.data,
        dashboardData: state?.dashboard,
        jobData: state.jobs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNannyDetailsAPICall: (nannyId, childId) => dispatch(getNannyDetailsAPICall(nannyId, childId)),
        fireNannyAPICall: (childId, obj) => dispatch(fireNannyAPICall(childId, obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NannyDetails);
