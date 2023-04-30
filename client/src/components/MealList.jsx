import React, { useState, useEffect } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import {
  Card,
  CardMedia,
  Grid
} from '@mui/material';
import { getMealPlanAPICall } from '../redux/mealplans/mealPlanActions';
import mealPlanImage from '../img/MealPlan.jpg';

const MealList = ({ getMealPlanAPICall, mealData }) => {
  console.log(mealData, "meal data ye rhaa")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { childId } = useParams();
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        getMealPlanAPICall(childId);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (childId !== undefined) { fetchData(); }
  }, [childId]);

  const buildCard = (meal) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={meal._id}>
        <Card
          variant='outlined'
          sx={{
            maxWidth: 345,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}>
          <CardHeader
            title={meal.meal}
          />
          <CardMedia
            component="img"
            height="194"
            image={mealPlanImage}
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
  } else {
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
    );
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
