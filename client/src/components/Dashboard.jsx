import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Button } from '@mui/material';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { createJobAPICall } from "../redux/jobs/jobActions";
import CreateJobModal from "./modals/CreateJobModal";
import {
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Avatar,
  Box
} from '@mui/material';
import { getDashboardAPICall } from '../redux/dashboard/dashboardActions';
import { getMyJobAPICall } from '../redux/jobs/jobActions';
import mealPlanImage from '../img/MealPlan.jpg';
import vaccineImage from '../img/vaccineimage.png';
import nannyImage from '../img/nanny.png';
import appointmentImage from '../img/appointmentImage.png';
import Loading from './Loading';
import ErrorPage from '../components/ErrorPage';


const Dashboard = ({ getDashboardAPICall, createJobAPICall, dashboardData, userData, childData, jobData, getMyJobAPICall }) => {
  // NO CONSOLE ERRORS
  // LOADING MISSING
  // ERRORS MISSING
  // REMOVE PARAMS

  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openCreateJobModal, setOpenCreateJobModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState({});

  const [errorPage, setErrorPage] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorCode, setErrorCode] = useState("");

  let { childId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (childData?.childObjs) {
      const childSelected = childData?.childObjs.find(obj => obj._id === childId);
      setSelectedChild(childSelected);
      if (childSelected?.jobId) {
        getMyJobAPICall(childSelected?.jobId);
      }
    }
  }, [childData]);

  useEffect(() => {
    if (userData !== undefined) {
      if (userData?.error !== "" && userData?.error !== undefined) {
        setErrorPage(true);
        setErrorText(userData?.error);
        setErrorCode(userData?.code);
      }
    }
    if (dashboardData !== undefined) {
      if (dashboardData?.error !== "" && dashboardData?.error !== undefined) {
        setErrorPage(true);
        setErrorText(dashboardData?.error);
        setErrorCode(dashboardData?.code);
      }
    }
  }, [userData, dashboardData]);

  const handleOpenCreateJob = () => setOpenCreateJobModal(true);
  const handleCloseCreateJob = () => setOpenCreateJobModal(false);

  const createJob = async (data, parentId, childId) => {
    await createJobAPICall(data, parentId, childId);
    handleCloseCreateJob();
    navigate("/myJob", {
      state: { jobId: selectedChild?.jobId, childId: selectedChild?._id },
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // getDashboardAPICall(childId); DONT USE THIS CALL, ITS BROKEN
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (childId !== undefined) {
      fetchData();
    }
  }, [childId]);


  if (!currentUser) {
    return <Navigate to='/' />;
  }

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (errorPage) {
    return (
      <div>
        <ErrorPage error={errorText} code={errorCode} />
      </div>
    );
  } else {
    return (
      <div>
        <br />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            src={selectedChild?.photoUrl}
            sx={{
              width: 64,
              height: 64,
              marginRight: 2
            }}
          />
          <h1>{selectedChild?.name}</h1>
        </div>
        <br />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={() => { navigate(-1); }}
            sx={{
              marginRight: '10px',
              padding: '10px 20px'
            }}
          >
            Back
          </Button>
          {userData?.data?.profile === "PARENT" && !selectedChild?.jobId && (
            <Button
              variant='contained'
              color='primary'
              onClick={handleOpenCreateJob}
              sx={{
                marginLeft: '10px',
                padding: '10px 20px'
              }}
            >
              Create Job
            </Button>
          )}
          {userData?.data?.profile === "PARENT" && !selectedChild?.jobId && openCreateJobModal ? (
            <CreateJobModal
              open={openCreateJobModal}
              onClose={handleCloseCreateJob}
              parentId={userData?.data?._id}
              childId={childId}
              createJob={createJob}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            />
          ) : null}
          {userData?.data?.profile === "PARENT" && selectedChild?.jobId && (
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                navigate("/myJob", {
                  state: { jobId: selectedChild?.jobId, childId: selectedChild?._id },
                });
              }}
              sx={{
                marginLeft: '10px',
                padding: '10px 20px'
              }}
            >
              View My Job
            </Button>
          )}
        </Box>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
            <CardActionArea>
              <Link to={`/meal/${selectedChild?._id?.toString()}`}>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    boxShadow:
                      'none'
                  }}
                  component='img'
                  image={mealPlanImage}
                  title='Meal Requirements'
                />
                <CardContent>
                  <Typography
                    sx={{
                      maxWidth: 345,
                      height: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 5,
                      border: '1px solid #080a33',
                      boxShadow: 'none'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                    {"Daily Meal Plans"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {selectedChild?.mealRequirements && selectedChild?.mealRequirements[0]?.meal
                      ? selectedChild?.mealRequirements[0]?.meal
                      : 'No data to display'}
                    <br></br>
                    {"Click to view Details"}
                  </Typography>
                  <dl>
                  </dl>
                </CardContent>
              </Link>
            </CardActionArea>
          </Grid>
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} >
            <CardActionArea sx={{ transition: 'none' }}>
              <Link to={`/vaccine/${selectedChild?._id?.toString()}`}>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    boxShadow:
                      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                  }}
                  component='img'
                  image={vaccineImage}
                  title='Vaccines'
                />
                <CardContent>
                  <Typography
                    sx={{
                      maxWidth: 345,
                      height: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 5,
                      boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                    {"Vaccines"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {selectedChild && selectedChild?.vaccine && selectedChild?.vaccine[0] && selectedChild?.vaccine[0]?.name && selectedChild?.vaccine[0]?.date
                      ? selectedChild?.vaccine[0]?.name + " due on " + selectedChild?.vaccine[0]?.date
                      : 'No data to display'}
                    <br></br>
                    {"Click to view details"}
                  </Typography>
                  <dl>
                  </dl>
                </CardContent>
              </Link>
            </CardActionArea>
          </Grid>
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
            <CardActionArea>
              <Link to={`/appointment/${selectedChild?._id?.toString()}`}>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    boxShadow:
                      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                  }}
                  component='img'
                  image={appointmentImage}
                  title='Appointments'
                />
                <CardContent>
                  <Typography
                    sx={{
                      maxWidth: 345,
                      height: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 5,
                      border: '1px solid #080a33',
                      boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                    {"Doctor Appointments"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {selectedChild && selectedChild?.appointments && selectedChild?.appointments[0]
                      ? selectedChild?.appointments[0]?.date + " : " + selectedChild?.appointments[0]?.doctor
                      : 'No data to display'}
                    <br></br>
                    {"Click to view details"}
                  </Typography>
                  <dl>
                  </dl>
                </CardContent>
              </Link>
            </CardActionArea>
          </Grid>
          {userData?.data?.profile === "PARENT" && jobData?.data?.nannyId && (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
              <CardActionArea>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    boxShadow: 'none'
                  }}
                  component='img'
                  height='200'
                  alt=''
                  image={dashboardData && dashboardData.data && dashboardData.data.nannyPhotoUrl
                    ? dashboardData.data.nannyPhotoUrl
                    : nannyImage
                  }
                  title='Nanny Details'
                />
                <CardContent>
                  <Typography
                    sx={{
                      maxWidth: 345,
                      height: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 5,
                      border: '1px solid #080a33',
                      boxShadow: 'none'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h1'
                  >
                    {"Nanny Details"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' color='primary' onClick={() => { navigate(`/nanny/${jobData?.data?.nannyId}`, { state: { childId: selectedChild?._id } }); }}>

                  View Nanny Details
                </Button>
              </CardActions>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    dashboardData: state?.dashboard,
    job: state?.jobs,
    userData: state.users,
    childData: state.child,
    jobData: state.jobs,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDashboardAPICall: (nannyId) => dispatch(getDashboardAPICall(nannyId)),
    createJobAPICall: (data, parentId, childId) => dispatch(createJobAPICall(data, parentId, childId)),
    getMyJobAPICall: (jobId) => dispatch(getMyJobAPICall(jobId)),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
