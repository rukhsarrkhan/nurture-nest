import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    CardHeader,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { purple } from "@mui/material/colors";
import SelectNanny from "./modals/SelectNanny";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import "../App.css";
import Container from "@mui/material/Container";
import Box, { BoxProps } from "@mui/material/Box";
import { applyToJobAPICall } from "../redux/jobs/jobActions";
import ApplyToJobModal from "./modals/ApplyToJobModal";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";
import ErrorPage from "../components/ErrorPage";

const JobDetails = ({ job, applyToJobAPICall }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showData, setShowData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const { currentUser } = useContext(AuthContext);

    let jobData = location.state.job;
    let nanny = location.state.nanny;
    // let jobId = location.state.jobId

    const [openApplyToJobModal, setOpenApplyToJobModal] = React.useState(false);
    const handleOpenApplyToJob = () => setOpenApplyToJobModal(true);
    const handleCloseApplyToJob = () => setOpenApplyToJobModal(false);

    const applyToJob = async (data, nannyId, jobId) => {
        applyToJobAPICall(data, nannyId, jobId);
        handleCloseApplyToJob();
        navigate("/job/viewAllJobs/1");
    };

    useEffect(() => {
        try {
            if (jobData) {
                setShowData(jobData);
                setLoading(false);
                setError(false);
            } else {
                setError(true);
                setLoading(false);
            }
        } catch (e) {
            setError(true);
            setErrorMsg(e);
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
        const getEDTTimeFromISOString = (dateString) => {
            const date = new Date(dateString);
            const options = {
                timeZone: "America/New_York",
                hour12: true,
                minute: "numeric",
                hour: "numeric",
            };
            return date.toLocaleString("en-US", options);
        };
        // const date = new Date(showData?.applyDate?.toLocaleString("en-US", {timeZone: "America/New_York",hour: "numeric",minute: "numeric"}));
        // const formattedDate = date.toLocaleString("en-US", {year: "numeric",month: "long",day: "numeric",hour: "numeric",minute: "numeric",second: "numeric",hour12: false});
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
                <Card sx={{ maxWidth: "70%", marginLeft: "15%", marginRight: "15%" }}>
                    <CardHeader />
                    <CardMedia component="img" height="50%" image={showData.photoUrl} alt="Nanny Image" />
                    <CardContent>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Description:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.description}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Special Care:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {showData?.specialCare}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Shift Time From:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {getEDTTimeFromISOString(showData?.shifts?.timeFrom)}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Shift Time To:
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ paddingLeft: "7px" }}>
                                {getEDTTimeFromISOString(showData?.shifts?.timeTo)}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Shift days:
                            </Typography>

                            <Typography color="text.secondary" paragraph>
                                {showData?.shifts?.days?.map((item) => item + ", ")}
                            </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography color="text.secondary" fontWeight="bold" paragraph>
                                Salary:
                            </Typography>
                            <Typography paragraph color="text.secondary" sx={{ paddingLeft: "7px" }}>
                                {showData?.salary + " USD per week"}
                            </Typography>
                        </div>
                        {showData.applied ? (
                            <Button
                                onClick={handleOpenApplyToJob}
                                variant="filled"
                                sx={{ bgcolor: "purple[700]", textcolor: "white" }}
                                disabled={showData.applied}
                            >
                                Applied
                            </Button>
                        ) : (
                            <Button
                                onClick={handleOpenApplyToJob}
                                variant="filled"
                                sx={{ bgcolor: "purple[700]", textcolor: "white" }}
                                disabled={showData.applied}
                            >
                                Apply
                            </Button>
                        )}

                        {openApplyToJobModal && (
                            <ApplyToJobModal
                                open={openApplyToJobModal}
                                onClose={handleCloseApplyToJob}
                                nannyId={nanny?._id}
                                jobId={showData?._id}
                                applyToJob={applyToJob}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            />
                        )}
                    </CardContent>
                </Card>
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
        applyToJobAPICall: (obj, nannyId, jobId) => dispatch(applyToJobAPICall(obj, nannyId, jobId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetails);

// export default Application;
