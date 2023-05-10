import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import SearchApplicants from "./SearchApplicants";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { useNavigate, Navigate } from "react-router-dom";
import "../App.css";
import Loading from "./Loading";
import ErrorPage from "../components/ErrorPage";
import { getallJobsAPICall, searchJobsAPICall } from "../redux/jobs/jobActions";
import { AuthContext } from "../firebase/Auth";

let noImage = "noImage";

const ViewAllJobs = ({ job, getallJobsAPICall, searchJobsAPICall, userData }) => {
    // CONSOLE ERRORS
    // LOADING MISSING
    // ERRORS MISSING
    let { pageNum } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [searchData, setSearchData] = useState(undefined);
    // const [searchPage, setSearchPage] = useState(1);
    const [showsData, setShowsData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [nextButton, setLastButton] = useState(true);
    const [errorCode, setErrorCode] = useState("");
    let card = null;
    let searchPage = 1;
    const { currentUser } = useContext(AuthContext);

    //View Applicants useEffect for apiCall
    useEffect(() => {
        if (pageNum) {
            getallJobsAPICall(userData?.data?._id, pageNum);
        }
    }, [pageNum]);

    // Common useEffect for setting data for rendering
    useEffect(() => {
        if (job !== undefined) {
            if (job?.error !== "") {
                setError(true);
                setErrorMsg(job?.error);
                setErrorCode(job?.code);
                setLoading(false);
            } else if (searchTerm) {
                setSearchData(job.jobsData.jobsFound);
                setLoading(false);
                setError(false);
            } else {
                setSearchData(job.jobsData.jobsFound);
                setShowsData(job.jobsData.jobsFound);
                setLoading(false);
                setError(false);
            }
        }
    }, [job]);

    //Search Applicants useEffect for apiCall
    useEffect(() => {
        async function fetchData() {
            if (pageNum) {
                searchJobsAPICall(userData?.data?._id, searchTerm, searchPage);
            }
        }
        if (searchTerm) {
            fetchData();
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };

    const getEDTTimeFromISOString = (dateString) => {
        const date = new Date(dateString);
        const options = {
            timeZone: "America/New_York",
            hour12: true,
            second: undefined,
        };
        return date.toLocaleTimeString("en-US", options);
    };

    const buildCard = (show) => {
        let shiftDays = "";
        let daysArr = show?.shifts?.days;
        for (let i in daysArr) {
            if (i != daysArr.length - 1) shiftDays = shiftDays + daysArr[i] + ", ";
            else shiftDays = shiftDays + daysArr[i];
        }
        return (
            <Grid item xs={12} sx={{ justifyContent: "center" }}>
                <Card
                    sx={{
                        maxWidth: "70%",
                        maxHeight: "350px",
                        paddingRight: 0,
                        marginLeft: "15%",
                        marginRight: "15%",
                        position: "relative",
                        borderRadius: "20px"
                    }}
                >
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4}>
                            <CardMedia component="img" height="100%" width={100} image={show?.photoUrl} alt="Paella dish" />
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{ paddingLeft: "10px" }}>
                            <CardContent>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="h1" color="text.secondary" paragraph>
                                        {show.state + ", "}
                                    </Typography>
                                    <Typography variant="h1" color="text.secondary" sx={{ paddingLeft: "10px" }}>
                                        {show.zipCode}
                                    </Typography>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ paddingRight: "10px" }}>
                                        Child Name:
                                    </Typography>
                                    <Typography color="text.secondary">{show.name}</Typography>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <Typography variant="body1" color="text.secondary" fontWeight="bold" sx={{ paddingRight: "10px" }}>
                                        Age:
                                    </Typography>
                                    <Typography color="text.secondary">{show.age}</Typography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ paddingRight: "10px" }}>
                                        Shifts Timings:
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {getEDTTimeFromISOString(show?.shifts?.timeFrom) + "  -  " + getEDTTimeFromISOString(show?.shifts?.timeTo)}
                                    </Typography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ paddingRight: "10px" }}>
                                        Shift Days:
                                    </Typography>
                                    <Typography color="text.secondary">{shiftDays}</Typography>
                                </div>
                                {/* <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Description:
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {show.description.length > 150
                      ? show.description.substring(0, 150) + " ..."
                      : show.description}
                  </Typography>
                </div> */}
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ paddingRight: "10px" }}>
                                        Salary:
                                    </Typography>
                                    <Typography color="text.secondary" paragraph>
                                        {show.salary + " USD per hour"}
                                    </Typography>
                                </div>
                            </CardContent>
                            <CardActions disableSpacing style={{ position: "absolute", bottom: 0, right: 0 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        navigate("/job/viewJobDetails", { state: { job: show, nanny: userData?.data } });
                                    }}
                                    sx={{ bgcolor: purple[700] }}
                                >
                                    View Job
                                </Button>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        );
    };

    if (searchTerm) {
        card =
            searchData &&
            searchData.map((show) => {
                return buildCard(show);
            });
    } else {
        card =
            showsData &&
            showsData.map((show) => {
                return buildCard(show);
            });
    }

    if (!currentUser) {
        return <Navigate to="/" />;
    }
    if (loading) {
        return <Loading />;
    } else if (error) {
        return <ErrorPage error={errorMsg} code={errorCode} />;
    } else {
        return (
            <div>
                <SearchApplicants searchValue={searchValue} />
                <br />
                <Button
                    onClick={() => {
                        navigate(-1);
                    }}
                    variant="filled"
                    sx={{ bgcolor: purple[700] }}
                >
                    Back
                </Button>
                <br />
                <br />

                <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
                    {card}
                </Grid>
                {pageNum > 1 && searchTerm == "" && (
                    <Link className="showlink" to={`/job/viewAllJobs/${pageNum - 1}`}>
                        Previous
                    </Link>
                )}
                {nextButton && searchTerm == "" && job.jobsData.remaining > 0 && (
                    <Link className="showlink" to={`/job/viewAllJobs/${parseInt(pageNum) + 1}`}>
                        Next
                    </Link>
                )}
                <p>{searchPage}</p>
                {searchTerm != "" && searchPage > 1 && (
                    <Link
                        component="button"
                        className="showlink"
                        onClick={() => {
                            searchPage = searchPage - 1;

                            searchJobsAPICall(searchTerm, searchPage);
                        }}
                    >
                        Previous Search
                    </Link>
                )}
                {searchTerm != "" && job.jobsData.remaining > 0 && job.jobsData.remaining > 0 && (
                    <Link
                        component="button"
                        className="showlink"
                        onClick={() => {
                            searchPage = searchPage + 1;

                            searchJobsAPICall(searchTerm, searchPage);
                        }}
                    >
                        Next Search
                    </Link>
                )}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        job: state.jobs,
        userData: state?.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getallJobsAPICall: (nannyId, pageNum) => dispatch(getallJobsAPICall(nannyId, pageNum)),
        searchJobsAPICall: (nannyId, searchTerm, pageNum) => dispatch(searchJobsAPICall(nannyId, searchTerm, pageNum)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllJobs);

// export default EventList;
