import React, {useState, useEffect} from 'react';
import '../App.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { getMealPlanAPICall } from '../redux/mealplans/mealPlanAction';

const MealList = ({getMealPlanAPICall, mealData}) => {
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
        getMealPlanAPICall(childId)
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

  const buildCard = (meal) => {
    console.log(meal, "idhar dekh bsdk")
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={meal}>
            <Card
                variant='outlined'
                sx={{
                    maxWidth: 345,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    // border: '1px solid #080a33',
                    boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                }}>
                <CardHeader
                    title={meal}
             //     subheader={vaccines.date}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={""}
                />
                <CardActions disableSpacing>

                    {/* <IconButton onClick={() => handleOpen} color='error' aria-label="Add Vaccine">
                        <FavoriteIcon />
                    </IconButton> */}

                </CardActions>

            </Card>
        </Grid >

    );
};


card =
mealData &&
mealData.data &&
mealData.data.map((meal) => {
    if (meal !== null) {
        return buildCard(meal);
    }
});

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
  <div>
     <Grid
                        container
                        spacing={2}
                        sx={{
                            flexGrow: 1,
                            flexDirection: 'row'
                        }}
                    >
                        {card}
                        
                    </Grid>
  </div>
    )
  };
    
  };

  const mapStateToProps = state => {
    return {
        mealData: state.meals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMealPlanAPICall: (childId) => dispatch(getMealPlanAPICall(childId)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MealList);
 