import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Button } from '@mui/material';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { createJobAPICall } from "../redux/jobs/jobActions";
import CreateJobModal from "./modals/CreateJobModal";
import {
  Card,
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
import mealPlanImage from '../img/MealPlan.jpg';
import vaccineImage from '../img/vaccineimage.png';
import nannyImage from '../img/nanny.png';
import appointmentImage from '../img/appointmentImage.png';
import Loading from './Loading';

const Dashboard = ({ getDashboardAPICall, createJobAPICall, dashboardData }) => {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  let items = JSON.parse(localStorage.getItem("userData"));
  let profile = items?.profile;
  console.log(dashboardData.data, "ksdjhkszhdks")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { childId } = useParams();

  const [openCreateJobModal, setOpenCreateJobModal] = useState(false);
  const handleOpenCreateJob = () => setOpenCreateJobModal(true);
  const handleCloseCreateJob = () => setOpenCreateJobModal(false);

  const createJob = async (data, parentId, childId) => {
    await createJobAPICall(data, parentId, childId);
    handleCloseCreateJob();
    navigate("/myJob", {
      state: { jobId: dashboardData?.data?.jobId, childId: dashboardData?.data?._id },
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        getDashboardAPICall(childId);
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
  } else if (error) {
    return (<div>
      Error here
    </div>
    );
  } else {
    return (
      <div>
        <br />
        <Typography variant="body1" sx={{ 
  color: 'white', 
  bgcolor: 'purple', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
  height: 80, 
  fontSize: 24,
  fontWeight: 'bold',
  borderRadius: '0px',
  padding: '0px 32px',
  }}>
    <Avatar 
      src={dashboardData?.data?.photoUrl} 
      sx={{ 
        width: 64, 
        height: 64, 
        marginRight: 2 
      }} 
    />
    {dashboardData?.data?.name}
</Typography>
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
  {profile === "PARENT" && !dashboardData?.data?.jobId && (
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
  {profile === "PARENT" && !dashboardData?.data?.jobId && openCreateJobModal ? (
    <CreateJobModal
      open={openCreateJobModal}
      onClose={handleCloseCreateJob}
      parentId={items?._id}
      childId={childId}
      createJob={createJob}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    />
  ) : null}
  {profile === "PARENT" && dashboardData?.data?.jobId && (
    <Button
      variant='contained'
      color='primary'
      onClick={() => {
        navigate("/myJob", {
          state: { jobId: dashboardData?.data?.jobId,childId: dashboardData?.data?._id },
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
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData?.data?._id?.toString()}>
            <CardActionArea>
              <Link to={`/meal/${dashboardData?.data?._id?.toString()}`}>
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
                    {dashboardData?.data?.mealRequirements && dashboardData?.data?.mealRequirements[0]?.meal
                      ? dashboardData?.data?.mealRequirements[0]?.meal
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
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData?.data?._id?.toString()}>
            <CardActionArea sx={{ transition: 'none' }}>
              <Link to={`/vaccine/${dashboardData?.data?._id?.toString()}`}>
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
                    {dashboardData && dashboardData?.data && dashboardData?.data?.vaccine && dashboardData?.data?.vaccine[0] && dashboardData?.data?.vaccine[0]?.name && dashboardData?.data?.vaccine[0]?.date
                      ? dashboardData?.data?.vaccine[0]?.name + " due on " + dashboardData?.data?.vaccine[0]?.date
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
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData?.data?._id?.toString()}>
            <CardActionArea>
              <Link to={`/appointment/${dashboardData?.data?._id?.toString()}`}>
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
                    {dashboardData && dashboardData?.data && dashboardData?.data?.appointments && dashboardData?.data?.appointments[0]
                      ? dashboardData?.data?.appointments[0]?.date + " : " + dashboardData?.data?.appointments[0]?.doctor
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
        {profile === "PARENT" ? (
           <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData?.data?.nannyId?.toString()}>
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
             <CardActions>
             </CardActions>
             <Button variant='contained' color='primary' onClick={() => { navigate(`/nanny/${dashboardData?.data?._id?.toString()}`, { state: { childId: dashboardData?.data?._id } }); }}>
               View Nanny Details
             </Button>
           </CardActionArea>
         </Grid>
        ): null}
        </Grid>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    dashboardData: state?.dashboard,
    job: state?.jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDashboardAPICall: (nannyId) => dispatch(getDashboardAPICall(nannyId)),
    createJobAPICall: (data, parentId, childId) => dispatch(createJobAPICall(data, parentId, childId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
