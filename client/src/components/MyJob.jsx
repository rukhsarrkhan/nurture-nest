import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useLocation, useNavigate,Navigate } from "react-router-dom";
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
import { getMyJobAPICall } from "../redux/jobs/jobActions";
import { deleteJobAPICall } from "../redux/jobs/jobActions";
import DeleteJobModal from "./modals/DeleteJobModal";
import { AuthContext } from '../firebase/Auth';
import Loading from "./Loading";
import ErrorPage from '../components/ErrorPage';

const MyJob = ({ job, getMyJobAPICall,deleteJobAPICall }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [errorCode, setErrorCode] = useState("");

  const [openDeleteJobModal, setOpenDeleteJobModal] = useState(false);
  const handleOpenDeleteJob = () => setOpenDeleteJobModal(true);
  const handleCloseDeleteJob = () => setOpenDeleteJobModal(false);

  
  console.log(location.state, "appID heree");
  //   let application = location.state.application
  let jobId = location.state.jobId
  let pageNum = 1;

const deleteJob = async (jobId) => {
    deleteJobAPICall(jobId);
    setOpenDeleteJobModal(false);
    navigate(-1)
}

  useEffect(() => {
      if (jobId) {
        getMyJobAPICall(jobId);
      }
  }, [jobId]);

  useEffect(() => {
    if (job !== undefined) {
      if (job?.error !== "") {
          setError(true);
          setErrorMsg(job?.error);
          setErrorCode(job?.code);
          setLoading(false)
      }else{
      setShowData(job.data);
      setLoading(false);
      setError(false);
    }}
  }, [job]);

  if (!currentUser) {
    return <Navigate to='/' />;
  }
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (error) {
    return (
      <ErrorPage error={errorMsg} code={errorCode} />
    );
  } else {
    let shiftDays = "";
    let daysArr = showData?.shifts?.days;
    for (let i in daysArr) {
      if (i != daysArr.length - 1) shiftDays = shiftDays + daysArr[i] + ", ";
      else shiftDays = shiftDays + daysArr[i];
    }
    const getEDTTimeFromISOString = (dateString) => {
      const date = new Date(dateString);
      const options = {
        timeZone: "America/New_York",
        hour12: true,
        second: undefined,
      };
      return date.toLocaleTimeString("en-US", options);
    };

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
        </Button>
        <br />
        <br />
        <Card sx={{ maxWidth: "70%", marginLeft: "15%" }}>
          <CardContent>
            <Typography variant="h3" component="h1" color="text.primary">
              My Job
            </Typography>
          </CardContent>
          <CardContent>
            <div style={{ display: "flex" }}>
              <Typography paragraph color="text.primary">
                Description:
              </Typography>
              <Typography
                paragraph
                color="text.secondary"
                sx={{ paddingLeft: "7px" }}
              >
                {showData?.description}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Address:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "7px" }}
              >
                {showData?.address}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                City:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "5px" }}
              >
                {showData?.city}
              </Typography>

              <Typography
                color="text.primary"
                paragraph
                sx={{ paddingLeft: "15px" }}
              >
                State:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "5px" }}
              >
                {showData?.state}
              </Typography>

              <Typography
                color="text.primary"
                paragraph
                sx={{ paddingLeft: "15px" }}
              >
                ZipCode:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "5px" }}
              >
                {showData?.zipCode}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Special Care:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "7px" }}
              >
                {showData?.specialCare}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Shift Time From:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "7px" }}
              >
                {getEDTTimeFromISOString(showData?.shifts?.timeFrom)}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Shift Time To:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "7px" }}
              >
                {getEDTTimeFromISOString(showData?.shifts?.timeTo)}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Shift days:
              </Typography>

              <Typography color="text.secondary" paragraph>
                {shiftDays}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography color="text.primary" paragraph>
                Salary:
              </Typography>
              <Typography
                color="text.secondary"
                paragraph
                sx={{ paddingLeft: "7px" }}
              >
                {showData?.salary + " USD per hour"}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <br />
        {!showData.nannyId && (
          <Button
            variant="contained"
            onClick={() => {
              navigate("/job/allApplicantions/1", {
                state: { jobId: showData._id },
              });
            }}
            sx={{ bgcolor: purple[700] }}
          >
            View Nanny Applications
          </Button>
        )}
        <br />
        <Button onClick={handleOpenDeleteJob} variant="filled" sx={{bgcolor:purple[700]}}>Delete Job</Button>
        {openDeleteJobModal && <DeleteJobModal
                        open={openDeleteJobModal}
                        onClose={handleCloseDeleteJob}
                        jobId={jobId}
                        deleteJob={deleteJob}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
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
    getMyJobAPICall: (jobId) => dispatch(getMyJobAPICall(jobId)),
    deleteJobAPICall:(jobId) => dispatch(deleteJobAPICall(jobId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyJob);
