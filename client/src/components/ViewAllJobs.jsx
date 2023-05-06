import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SearchApplicants from "./SearchApplicants";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, getAlertTitleUtilityClass,} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { connect } from 'react-redux';
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { getallJobsAPICall, searchJobsAPICall } from "../redux/jobs/jobActions";

let noImage = "noImage";

const ViewAllJobs = ({ job, getallJobsAPICall,searchJobsAPICall }) => {
  let { pageNum } = useParams();
  const navigate = useNavigate();
  // const job = useSelector((state) => state.jobs);
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextButton, setLastButton] = useState(true);
  let card = null;
  let pagenum = pageNum;


  //View Applicants useEffect for apiCall
  useEffect(() => {
    try {
      console.log("1st use effect fired", pageNum);
      if (pageNum) {
        getallJobsAPICall(pageNum);
      }
    } catch (e) {
      setError(true);
      setErrorMsg(e)
      setLoading(false);
    }
  }, [pageNum]);


// Common useEffect for setting data for rendering
  useEffect(() => {
    console.log("2nd use effect fired", job);

    if (searchTerm) {
      try {
        setSearchData(job.jobsData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setErrorMsg(e)
        setLoading(false);
      }
    } else {
      try {
        setSearchData(job.jobsData);
        setShowsData(job.jobsData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setErrorMsg(e)
        setLoading(false);
      }
    }
  }, [job]);



    //Search Applicants useEffect for apiCall
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("search use effect fired", pageNum);
        if (pageNum) {searchJobsAPICall(searchTerm,1)}
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {fetchData()}
  }, [searchTerm]);

  
  const searchValue = async (value) => {setSearchTerm(value)};

  const getEDTTimeFromISOString = (dateString) => {
    const date = new Date(dateString);
    const options = { timeZone: 'America/New_York', hour12: true, second: undefined };
    return date.toLocaleTimeString('en-US', options);
  }

  const buildCard = (show) => {
    console.log(show);
    let shiftDays=""
    let daysArr = show?.shifts?.days
    for(let i in daysArr){
        if (i!=daysArr.length-1) shiftDays=shiftDays+daysArr[i]+", "
        else shiftDays=shiftDays+daysArr[i]
    }
    return (
      <Grid item xs={12} key={show.id} sx={{ justifyContent: "center" }}>
        <Card
          sx={{
            maxWidth: "70%",
            maxHeight: 300,
            paddingRight: 0,
            marginLeft: "15%",
            marginRight: "15%",
            position: "relative",
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12} sm={4}>
              <CardMedia
                component="img"
                height="100%"
                width={100}
                image="https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2023/03_29_revuelto/gate_models_s_02_m.jpg"
                alt="Paella dish"
              />
            </Grid>
            <Grid item xs={12} sm={8} sx={{ paddingLeft: "10px" }}>
              <CardContent>
                <div style={{ display: "flex" }}>
                  <Typography variant="h4" color="text.secondary" paragraph>{show.city+", "}</Typography>
                  <Typography variant="h4" color="text.secondary" sx={{ paddingLeft: "10px" }} paragraph>{show.zipCode}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Shifts Timings:
                  </Typography>
                  <Typography color="text.secondary">
                    {getEDTTimeFromISOString(show?.shifts.timeFrom)+"  -  "+getEDTTimeFromISOString(show?.shifts.timeTo)}
                  </Typography>

                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Shift Days:
                  </Typography>
                  <Typography color="text.secondary" paragraph>{shiftDays}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Description:
                  </Typography>
                  <Typography color="text.secondary" paragraph>{show.description.length > 250   
                      ? show.description.substring(0, 250) + " ..."
                      : show.description}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Salary:
                  </Typography>
                  <Typography color="text.secondary" paragraph>{show.salary+" USD per week"}</Typography>
                </div>
              </CardContent>
              <CardActions
                disableSpacing
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                <Button variant="contained" onClick={() => { navigate('/job/viewJobDetails', { state: { job: show } }); }} sx={{ bgcolor: purple[700] }}>
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
      searchData.map((shows) => {
        console.log("coming here");
        return buildCard(shows);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }




  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>{errorMsg}</h2>
      </div>
    );
  } else {
    return (
      <div>

        <SearchApplicants searchValue={searchValue} />
        <br/>
        <Button  onClick={() => {navigate(-1)}} variant="filled" sx={{bgcolor:purple[700]}}>Back</Button>	
        <br />
        <br />
        
        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
          {card}
        </Grid>
        <br />
        <br />
        {pagenum > 1 && (<Link className="showlink" to={`/job/job/viewAllJobs/${pageNum - 1}`}>Previous</Link>)}
        {nextButton && (<Link className="showlink" to={`/job/viewAllJobs/${parseInt(pagenum) + 1}`}>Next</Link>)}
      </div>
      
    );
  }
};

const mapStateToProps = state => {
  return {
    job: state.jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getallJobsAPICall: (pageNum) => dispatch(getallJobsAPICall(pageNum)),
    searchJobsAPICall: (searchTerm, pageNum) => dispatch(searchJobsAPICall(searchTerm, pageNum))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewAllJobs);

// export default EventList;