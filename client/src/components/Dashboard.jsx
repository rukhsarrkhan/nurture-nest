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
  Typography
} from '@mui/material';
import { getDashboardAPICall } from '../redux/dashboard/dashboardActions';
import Navbar from './Navbar';

const Dashboard = ({ getDashboardAPICall, dashboardData }) => {
  console.log(dashboardData, "new dashboard data")
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
    console.log(dashboardData, "data aaya")
    return (
      <Grid container spacing={2}>
        <Grid item xs={6} key={dashboardData && dashboardData.data && dashboardData.data.nannyId}>
          <Card
            variant='outlined'

          >
            <CardActionArea>
              <Link to={`/meal/${dashboardData && dashboardData.data && dashboardData.data.childId}`}>
                <CardMedia
                  sx={{
                    height: '100%',
                    width: '100%'
                  }}
                  component='img'
                  image={""}
                  title='Meal Requirements'
                />

                <CardContent>
                  <Typography
                    sx={{
                      borderBottom: '1px solid #1e8678',
                      fontWeight: 'bold'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {dashboardData && dashboardData.data && dashboardData.data.mealRequirements && dashboardData.data.mealRequirements[0]
                      ? dashboardData.data.mealRequirements[0]
                      : 'No data to display'}
                  </Typography>
                  <dl>
                  </dl>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} key={dashboardData && dashboardData.data && dashboardData.data.nannyId}>
          <Card
            variant='outlined'

          >
            <CardActionArea>
              <Link to={`/vaccine/${dashboardData && dashboardData.data && dashboardData.data.childId}`}>
                <CardMedia
                  sx={{
                    height: '100%',
                    width: '100%'
                  }}
                  component='img'
                  image={""}
                  title='Vaccines'
                />

                <CardContent>
                  <Typography
                    sx={{
                      borderBottom: '1px solid #1e8678',
                      fontWeight: 'bold'
                    }}
                    gutterBottom
                    variant='h6'
                    component='h2'
                  >
                    {dashboardData && dashboardData.data && dashboardData.data.vaccineDetails && dashboardData.data.vaccineDetails[0].name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {dashboardData && dashboardData.data && dashboardData.data.vaccines && dashboardData.data.vaccineDetails[0] && dashboardData.data.vaccineDetails[0].name
                      ? dashboardData.data.vaccineDetails[0].name
                      : 'No data to display'}
                  </Typography>
                  <dl>
                  </dl>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
        {/* <Grid item xs={6} key={data.nannyId}>
        <Card
          variant='outlined'
         
        >
         <CardActionArea>
            <Link to={`/appointments/${dashboardData.data.childId}`}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={ "" }      
                title='show image'
              />
              <CardContent>
                <Typography
                  sx={{
                    borderBottom: '1px solid #1e8678',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h2'
                >
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {dashboardData.data.appointmentDetails && dashboardData.data.appointmentDetails[0]
                    ? dashboardData.data.appointmentDetails
                    : 'No data to display'}
                </Typography>
                <dl>
                    </dl>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid> */}
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