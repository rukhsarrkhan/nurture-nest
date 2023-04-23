import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { getDashboardAPICall } from '../redux/dashboard/dashboardActions';

const Dashboard = ({ getDashboardAPICall, dashboardData }) => {
  console.log(dashboardData, "new dashboard data")
  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data,setData] = useState([])
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
    if(nannyId != undefined) { 
      fetchData()}
  }, [nannyId]);

//   card =
//         dashboardData &&
//         dashboardData.data &&
//         dashboardData.data.map((dashboard) => {
//             if (dashboard !== null) {
//                 return buildCard(dashboard);
//         }
// });


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
    }else{
      console.log(data)
      return (
        <Grid container spacing={2}>
      <Grid item xs={6} key={data.nannyId}>
        <Card
          variant='outlined'
         
        >
          <CardActionArea>
            <Link to={`/meal/${dashboardData.childId}`}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={ "" }      
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
                  {dashboardData.data
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
      <Grid item xs={6} key={dashboardData.data.nannyId}>
        <Card
          variant='outlined'
         
        >
          <CardActionArea>
            <Link to={`/vaccine/${dashboardData.data.childId}`}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={ "" }      
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
                  {data.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {dashboardData.data.vaccines && dashboardData.data.vaccineDetails[0].vaccines.name
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
           <Grid item xs={6} key={data.nannyId}>
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
      </Grid>

      </Grid>
    );
  };
    
  };

  const mapStateToProps = state => {
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