import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  CardHeader,
  Divider,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { purple } from "@mui/material/colors";
import SelectNanny from "./modals/SelectNanny";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import "../App.css";
import Container from "@mui/material/Container";
import Box, { BoxProps } from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import { getMyJobAPICall, fireNannyAPICall } from "../redux/jobs/jobActions";
import { deleteJobAPICall } from "../redux/jobs/jobActions";
import DeleteJobModal from "./modals/DeleteJobModal";
import FireNannyModal from "./modals/FireNannyModal";

const MyJob = ({ job, getMyJobAPICall, deleteJobAPICall, fireNannyAPICall }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState('');


  const [openDeleteJobModal, setOpenDeleteJobModal] = useState(false);
  const handleOpenDeleteJob = () => setOpenDeleteJobModal(true);
  const handleCloseDeleteJob = () => setOpenDeleteJobModal(false);

  const handleOpen2 = (id) => {
    setDeleteId(id);
    setOpen2(true);
  };
  
  const handleClose2 = () => setOpen2(false);
  
  //   let application = location.state.application
  
  let jobId = location.state.jobId
  let childId = location.state.childId
  let pageNum = 1;

  const deleteJob = async (jobId) => {
    deleteJobAPICall(jobId);
    setOpenDeleteJobModal(false);
    navigate(-1)
  }

  const fireNanny = async (childId) => {
    await fireNannyAPICall(childId, job?.data?.nannyId);
    setOpen2(false);
    await getMyJobAPICall(jobId);
  };

  useEffect(() => {
    try {
      console.log("1st use effect fired", jobId, pageNum);
      if (jobId) {
        getMyJobAPICall(jobId);
      }
    } catch (e) {
      console.log("error===>", e);
      setError(true);
      setErrorMsg(e);
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    console.log("2nd use effect fired", job);
    try {
      setShowData(job.data);
      setLoading(false);
      setError(false);
    } catch (e) {
      setError(true);
      setErrorMsg(e);
      setLoading(false);
    }
  }, [job]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>Error404: No data found</h2>
      </div>
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
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              navigate(-1);
            }}
            variant="contained"
            color="primary"
            sx={{ marginBottom: "2rem", marginLeft: 'auto' }}
          >
            Back
          </Button>

          <Button
            onClick={handleOpenDeleteJob}
            variant="contained"
            color="error"
            sx={{ marginBottom: "2rem", marginRight: "auto", marginLeft: '0.5rem' }}
          >
            Delete Job
          </Button>
          {/* <IconButton onClick={() => handleOpen2(childId)} color='textSecondary' aria-label="Fire Nanny" sx={{ marginBottom: "1rem" }}>
          <DeleteIcon /> Fire Nanny
          </IconButton> */}
        </div>
        {openDeleteJobModal && (
          <DeleteJobModal
            open={openDeleteJobModal}
            onClose={handleCloseDeleteJob}
            jobId={jobId}
            deleteJob={deleteJob}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          />
        )}
        {open2 && <FireNannyModal
          open={open2}
          onClose={handleClose2}
          _id={deleteId}
          fireNanny={fireNanny}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />}
        <Card sx={{ maxWidth: "80%", margin: "0 auto" }}>
          <CardContent>
            <Typography variant="h4" component="h1" color="text.primary" gutterBottom
              sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>
              My Listed Job
            </Typography>
            <Divider sx={{ marginBottom: "1rem" }} />
            <Typography variant="h5" component="h2" color="text.secondary">
              Description:
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ marginBottom: "1rem" }}>
              {showData?.description}
            </Typography>
            <Divider sx={{ marginBottom: "1rem" }} />
            <Typography variant="h5" component="h2" color="text.secondary">
              Address:
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ marginBottom: "1rem" }}>
              {showData?.address}, {showData?.city}, {showData?.state} {showData?.zipCode}
            </Typography>
            <Divider sx={{ marginBottom: "1rem" }} />
            <Typography variant="h5" component="h2" color="text.secondary">
              Special Care:
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ marginBottom: "1rem" }}>
              {showData?.specialCare}
            </Typography>
            <Divider sx={{ marginBottom: "1rem" }} />
            <Typography variant="h5" component="h2" color="text.secondary">
              Shift:
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ marginBottom: "1rem" }}>
              {shiftDays} from {getEDTTimeFromISOString(showData?.shifts?.timeFrom)} to {getEDTTimeFromISOString(showData?.shifts?.timeTo)}
            </Typography>
            <Divider sx={{ marginBottom: "1rem" }} />
            <Typography variant="h5" component="h2" color="text.secondary">
              Salary:
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ marginBottom: "1rem" }}>
              {showData?.salary} USD per hour
            </Typography>
          </CardContent>
        </Card>
        {!showData.nannyId && (
          <Button
            variant="contained"
            onClick={() => {
              navigate("/job/allApplicantions/1", {
                state: { jobId: showData._id },
              });
            }}
            color="primary"
            sx={{ marginTop: "2rem", marginRight: "0.5rem" }}
          >
            View Nanny Applications
          </Button>
        )}
        {showData.nannyId && (
        <Button
          onClick={() => handleOpen2(childId)}
            variant="contained"
            color="error"
            sx={{  marginTop: "2rem",marginRight: "auto", marginLeft: '0.5rem' }}
          >
            Fire Nanny
          </Button>
        )}
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
    deleteJobAPICall: (jobId) => dispatch(deleteJobAPICall(jobId)),
    fireNannyAPICall: (childId, obj) => dispatch(fireNannyAPICall(childId, obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyJob);
