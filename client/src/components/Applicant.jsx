import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia, Typography, CardHeader } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { purple } from "@mui/material/colors";
import SelectNanny from "./modals/SelectNanny";
import { AuthContext } from "../firebase/Auth";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import "../App.css";
import Container from "@mui/material/Container";
import Box, { BoxProps } from "@mui/material/Box";
import { selectNannyAPICall } from "../redux/jobs/jobActions";
import Loading from "./Loading";
import ErrorPage from "../components/ErrorPage";

const Application = ({ job, selectNannyAPICall }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showData, setShowData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const { currentUser } = useContext(AuthContext);
    let application = location.state.application;
    let jobId = location.state.jobId;

    const [selectNannyModal, setSelectNannyModal] = React.useState(false);
    const handleOpenSelectNanny = () => setSelectNannyModal(true);
    const handleCloseSelectNanny = () => setSelectNannyModal(false);

    const selectNanny = async (jobId, nannyId) => {
        selectNannyAPICall(jobId, nannyId);
        setSelectNannyModal(false);
        navigate(-2);
    };

    useEffect(() => {
        if (application) {
            setShowData(application);
            setLoading(false);
            setError(false);
        } else {
            setError(true);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (job !== undefined) {
            if (job?.error !== "") {
                setError(true);
                setErrorMsg(job?.error);
                setErrorCode(job?.code);
                setLoading(false);
            }
            if (application) {
                setShowData(application);
                setLoading(false);
                setError(false);
            } else {
                setError(true);
                setLoading(false);
            }
        }
    }, [job]);

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
        return <ErrorPage error={errorMsg} code={errorCode} />;
    } else {
        function getEDTTimeFromISOString(dateString) {
            const date = new Date(dateString);
            const options = { timeZone: "America/New_York", hour12: true };
            return date.toLocaleString("en-US", options);
        }
        return (
            <Container sx={{ justifyContent: "center" }}>
                <Button
                    onClick={() => {
                        navigate(-1);
                    }}
                    variant="filled"
                    sx={{ bgcolor: purple[700] }}
                >
                    Back
                </Button>{" "}
                <br />
                <br />
                <Card sx={{ maxWidth: "50%", marginLeft: "25%", marginRight: "25%" }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
                                {showData?.nannyName[0]}
                            </Avatar>
                        }
                        title={showData?.nannyName}
                        subheader={`Applied to job on ${getEDTTimeFromISOString(showData?.applyDate)}`}
                    />
                    <CardMedia component="img" height="50%" width="50%" image={showData.photoUrl} alt="Nanny Image" />
                    <CardContent></CardContent>
                    <CardContent>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Why Mee:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.whySelect}
                            </Typography>
                        </div>

                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Experience
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.experience}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Cover Letter:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.attachment}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Disability:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.disability}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Shift Punctuality:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.shiftPuntuality}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                My Address:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.nannyAddress}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                How far do I stay:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.distance}
                            </Typography>
                        </div>

                        {selectNannyModal && (
                            <SelectNanny
                                open={selectNannyModal}
                                onClose={handleCloseSelectNanny}
                                jobId={jobId}
                                nannyId={showData?.nannyId}
                                nannyName={showData?.nannyName}
                                selectNanny={selectNanny}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            />
                        )}
                    </CardContent>
                </Card>
                <br />
                <Button onClick={handleOpenSelectNanny} variant="filled" sx={{ bgcolor: purple[700] }}>
                    Select this Nanny for Job
                </Button>
                <br />
                <br />
            </Container>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        job: state.jobs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectNannyAPICall: (jobId, nannyId) => dispatch(selectNannyAPICall(jobId, nannyId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Application);

// export default Application;
