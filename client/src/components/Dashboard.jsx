import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Link, useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { getDashboardAPICall } from '../redux/dashboard/dashboardActions';
import mealPlanImage from '../img/MealPlan.jpg';
import vaccineImage from '../img/vaccineimage.png';
import appointmentImage from '../img/appointmentImage.png';
import Loading from './Loading';

const Dashboard = ({ getDashboardAPICall, dashboardData }) => {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { childId } = useParams();
  const navigate = useNavigate();

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

                  {"Click to view details"}
                </Typography>
                <dl>
                </dl>
              </CardContent>
            </Link>
          </CardActionArea>
        </Grid>
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={dashboardData?.data?.nannyId?.toString()}>
          <CardActionArea>
            <CardMedia
              component='img'
              height='200'
              alt=''
            />
            <CardContent>
              <Typography
                gutterBottom
                variant='h5'
                component='div'
                sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
              >
                Nanny Details
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                {dashboardData && dashboardData.data.nannyId
                  ? "First Name: " + dashboardData.nannyId
                  : "First Name: " + 'No data to display'}
                <br />
                {/* {nannyData && nannyData.lastName
                      ? "Last Name: " + nannyData.lastName
                      : "Last Name: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.email
                      ? "Email: " + nannyData.email
                      : "Email: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.age
                      ? "Age: " + nannyData.age
                      : "Age: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.address
                      ? "Address: " + nannyData.address
                      : "Address: " + 'No data to display'} */}
              </Typography>
            </CardContent>
          </CardActionArea>
          <Button variant='contained' color='primary' onClick={() => { navigate(`/nanny/${dashboardData?.data?.nannyId?.toString()}`, { state: { childId: dashboardData?.data?._id } }); }}>
            View Nanny Details
          </Button>
        </Grid>
      </Grid>
    );
  };
};

const mapStateToProps = state => {
  return {
    dashboardData: state?.dashboard
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
