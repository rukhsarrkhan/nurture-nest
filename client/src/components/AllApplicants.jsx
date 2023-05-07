import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SearchApplicants from "./SearchApplicants";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { showAllApplicantsAPICall } from "../redux/jobs/jobActions";
import { searchApplicantsAPICall } from "../redux/jobs/jobActions";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import Container from "@mui/material/Container";
import "../App.css";

const AllApplicants = ({
  job,
  showAllApplicantsAPICall,
  searchApplicantsAPICall,
}) => {
  let { pageNum } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let jobId = location?.state?.jobId;
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
      if (pageNum && jobId) {
        setLoading(true);
        showAllApplicantsAPICall(jobId, pageNum);
      }
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [pageNum, jobId]);

  useEffect(() => {
    if (searchTerm) {
      try {
        setSearchData(job?.applicantsData);
        console.log(searchData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setErrorMsg(e);
        setLoading(false);
      }
    } else {
      try {
        setSearchData(job?.applicantsData);
        setShowsData(job?.applicantsData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setErrorMsg(e);
        setLoading(false);
      }
    }
  }, [job]);

  //Search Applicants useEffect for apiCall
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("search use effect fired", jobId, pageNum);
        if (pageNum) {
          searchApplicantsAPICall(jobId, searchTerm, pageNum);
        }
      } catch (e) {
        setError(true);
        setErrorMsg(e);
        setLoading(false);
        console.log(e);
      }
    }
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (show) => {
    const date = new Date(
      show.applyDate.toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
      })
    );
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    function getEDTTimeFromISOString(dateString) {
      const date = new Date(dateString);
      const options = { timeZone: "America/New_York", hour12: true };
      return date.toLocaleString("en-US", options);
    }
    const formattedDate = date.toLocaleString("en-US", options);
    console.log(show);
    return (
      // <Container fixed maxWidth="70%">
      <Grid item xs={12} key={show.id} sx={{ justifyContent: "center" }}>
        <Card
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            paddingRight: 0,
            marginLeft: "15px",
            marginRight: "15px",
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
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: purple[700] }} aria-label="recipe">
                        {show?.nannyName[0]}
                      </Avatar>
                    }
                    title={show.nannyName}
                    subheader={`Applied to job on ${getEDTTimeFromISOString(
                      show?.applyDate
                    )}`}
                  />
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Why me:
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {show?.whySelect}
                  </Typography>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Distance from your house:
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {show?.distance}
                  </Typography>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Experience:
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {show?.experience?.length > 250
                      ? show?.experience?.substring(0, 250) + " ..."
                      : show?.experience}
                  </Typography>
                </div>
              </CardContent>
              <CardActions
                disableSpacing
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                {/* <Link to={{pathname:"/job/applications/viewApplication" ,state:show._id }}> */}
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/job/applications/viewApplication", {
                      state: { application: show, jobId: jobId },
                    });
                  }}
                  sx={{ bgcolor: purple[700] }}
                >
                  Select
                </Button>
                {/* </Link> */}
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      // </Container>
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
        <Loading />
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

        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
          {card}
        </Grid>

        {pagenum > 1 && (
          <Link
            className="showlink"
            to={`/job/${jobId}/allApplicants/${pagenum - 1}`}
          >
            Previous
          </Link>
        )}
        {nextButton && (
          <Link
            className="showlink"
            to={`/job/${jobId}/allApplicants/${parseInt(pagenum) + 1}`}
          >
            Next
          </Link>
        )}
      </div>
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
    showAllApplicantsAPICall: (jobId, pageNum) =>
      dispatch(showAllApplicantsAPICall(jobId, pageNum)),
    searchApplicantsAPICall: (jobId, searchTerm, pageNum) =>
      dispatch(searchApplicantsAPICall(jobId, searchTerm, pageNum)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllApplicants);

// export default EventList;
