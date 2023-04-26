import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { getDashboardAPICall } from '../redux/dashboard/dashboardActions';
import mealPlanImage from '../img/MealPlan.jpg'
import vaccineImage from '../img/vaccineimage.png'
import appointmentImage from '../img/appointmentImage.png'

const Dashboard = ({ getDashboardAPICall, dashboardData }) => {
  console.log(dashboardData, "dashboard data")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { nannyId } = useParams();
  let card = null;

  useEffect(() => {
    console.log('on load use effect');
    async function fetchData() {
      try {
        getDashboardAPICall(nannyId)
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
        console.log(e);
      }
    }
    if (nannyId !== undefined) {
      fetchData()
    }
  }, [nannyId]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (<div>
      Error here
    </div>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData && dashboardData.data && dashboardData.data.nannyId}>
            <CardActionArea>
              <Link to={`/meal/${dashboardData && dashboardData.data && dashboardData.data.childId}`}>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    // border: '1px solid #080a33',
                    boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
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
                      boxShadow:	
                          '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                    {"Daily Meal Plans"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {dashboardData && dashboardData.data && dashboardData.data.mealRequirements && dashboardData.data.mealRequirements[0]
                      ? dashboardData.data.mealRequirements[0]
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
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData && dashboardData.data && dashboardData.data.nannyId}>
            <CardActionArea sx={{ transition: 'transform .2s' }}>
              <Link to={`/vaccine/${dashboardData && dashboardData.data && dashboardData.data.childId}`}>
                <CardMedia
                  sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    // border: '1px solid #080a33',
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
                      border: '1px solid #080a33',
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
                    {dashboardData && dashboardData.data && dashboardData.data.vaccineDetails && dashboardData.data.vaccineDetails[0] && dashboardData.data.vaccineDetails[0].name
                      ? dashboardData.data.vaccineDetails[0].name + " due on " + dashboardData.data.vaccineDetails[0].date 
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
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData.data.nannyId}>
         <CardActionArea>
            <Link to={`/appointment/${dashboardData.data.childId}`}>
              <CardMedia
                sx={{
                  maxWidth: 345,
                  height: 'auto',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: 5,
                 // border: '1px solid #080a33',
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
                  {dashboardData && dashboardData.data && dashboardData.data.appointmentDetails && dashboardData.data.appointmentDetails[0]
                    ? dashboardData.data.appointmentDetails[0].date + " : " + dashboardData.data.appointmentDetails[0].doctor
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
      </Grid>
    );
  };

};

const mapStateToProps = state => {
  console.log("state", state)
  return {
    dashboardData: state.dashboard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDashboardAPICall: (nannyId) => dispatch(getDashboardAPICall(nannyId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);