import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../firebase/Auth';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from '../components/ErrorPage';
import "../App.css";

const AllApplicants = ({
  users,
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
  const [errorCode, setErrorCode] = useState("");
  let card = null;
  let pagenum = pageNum;
  const { currentUser } = useContext(AuthContext);

  //View Applicants useEffect for apiCall
  useEffect(() => {
    if (pageNum) {
      setLoading(true);
      showAllApplicantsAPICall(jobId, pageNum);
    }
  }, [pageNum]);

  useEffect(() => {
    if (job !== undefined) {
      if (job?.error !== "") {
        setError(true);
        setErrorMsg(job?.error);
        setErrorCode(job?.code);
        setLoading(false);
      } else {
        if (searchTerm) {
          setSearchData(job?.applicantsData?.allApplications);
          setLoading(false);
          setError(false);
        } else {
          setSearchData(job?.applicantsData.allApplications);
          setShowsData(job?.applicantsData.allApplications);
          setLoading(false);
          setError(false);
        }
      }
    }
  }, [job]);

  useEffect(() => {
    if (job !== undefined) {
      if (job?.error !== "") {
        setError(true);
        setErrorMsg(job?.error);
        setErrorCode(job?.code);
        setLoading(false);
      } else if (searchTerm) { searchApplicantsAPICall(jobId, searchTerm, pageNum); }
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
                image={show.photoUrl}
                alt="client\public\download.jpeg"
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
                    subheader={`Applied to job on ${getEDTTimeFromISOString(show?.applyDate)}`}
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
      searchData.map((show) => {
        return buildCard(show);
      });
  } else {
    card = showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }


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
    return (
      <div>
        <SearchApplicants searchValue={searchValue} />

        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
          {card}
        </Grid>

        {pageNum > 1 && (
          <Link
            className="showlink"
            to={`/job/allApplicants/${parseInt(pagenum) - 1}`}
          >
            Previous
          </Link>
        )}
        {nextButton && (
          <Link className="showlink" to={`/job/allApplicantions/${parseInt(pageNum) + 1}`}>
            Next
          </Link>
        )}
        {/* <Link className="showlink" to={`/job/allApplicantions/${parseInt(pageNum)+1}`}>
            Next2
          </Link> */}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    job: state.jobs,
    users: state.users
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
