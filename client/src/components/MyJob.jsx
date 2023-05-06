import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
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

const MyJob = ({ job, getMyJobAPICall }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState(true);
  console.log(location.state, "appID heree");
  //   let application = location.state.application
  let jobId = "6444dc31477d85ad6f7103db";
  let pageNum = 1;

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
    console.log(showData, "=====================");
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
                {showData?.salary + " USD per week"}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyJob);
