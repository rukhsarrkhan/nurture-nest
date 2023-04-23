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

const MealList = () => {
  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data,setData] = useState([])
  let { childId } = useParams();
  let card = null;

  useEffect(() => {
    console.log('on load use effect');
    async function fetchData() {
      try {
      //  console.log(`https://localhost:3000/nanny/dashboard/${nannyId}`)
        const apiData  = await axios.get(`http://localhost:3000/child/${childId}`);
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
    if(childId != undefined) { fetchData()}
  }, [childId]);

  // card =
  // apiData &&
  // apiData.userPostedLocations.map((show) => {
  //   return buildCard(show);
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
                  {data.mealRequirements && data.mealRequirements[0] && data.mealRequirements[1]
                    ? data.mealRequirements[0] 
                    : 'No data to display'}
                </Typography>
                <dl>
                    </dl>
              </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      </Grid>
    );
  };
    
  };



export default MealList; 