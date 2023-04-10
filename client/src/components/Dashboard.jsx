import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

const Dashboard = () => {
  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data,setData] = useState({})
  let { nannyId } = useParams();
  let card = null;

  useEffect(() => {
    console.log('on load use effect');
    async function fetchData() {
      try {
        console.log(`https://localhost:3000/nanny/dashboard/${nannyId}`)
        const apiData  = await axios.get(`http://localhost:3000/nanny/dashboard/${nannyId}`);
        setData(apiData.data)
        console.log(data,"data here")
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
        console.log(e);
      }
    }
    fetchData();
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
    }else{
      console.log(data)
      return (
        <Grid container spacing={2}>
      <Grid item xs={6} key={data.nannyId}>
        <Card
          variant='outlined'
         
        >
          <CardActionArea>
            <Link to={`/meal/${data.childId}`}>
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
                  {data.mealRequirements
                    ? data.mealRequirements[0]
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
            <Link to={`/vaccine/${data.childId}`}>
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
                  {data.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {data.vaccines && data.vaccineDetails[0].vaccines.name
                    ? data.vaccineDetails[0].vaccines.name
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
            <Link to={`/appointments/${data.childId}`}>
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
                  {data.appointmentDetails && data.appointmentDetails[0]
                    ? data.appointmentDetails[0]
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



export default Dashboard; 