import React, { useState, useEffect } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import { mealPlanSetAPICall } from '../redux/mealplans/mealPlanActions';
import { delMealAPICall } from '../redux/mealplans/mealPlanActions';
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Card,
  CardMedia,
  Grid,
  CardContent,
  Typography
} from '@mui/material';
import { getMealPlanAPICall } from '../redux/mealplans/mealPlanActions';
import mealPlanImage from '../img/MealPlan.jpg';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import AddMealModal from './modals/AddMealModal';
import DeleteMealModal from './modals/DeleteMealModal';
import Collapse from '@mui/material/Collapse';

<<<<<<< HEAD
const MealList = ({ getMealPlanAPICall, mealData }) => {
  console.log(mealData, "meal data ye rhaa")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
=======

const MealList = ({ getMealPlanAPICall, mealData, mealPlanSetAPICall, delMealAPICall }) => {
>>>>>>> 2b2bce60876221731b9abf9a9fd0c86f05747f42
  let { childId } = useParams();
  let card = null;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState('')
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState({});

  const handleOpen = () => { setOpen(true) };
  const handleClose = () => setOpen(false);

  const handleOpen2 = (id) => {
    setDeleteId(id)
    setOpen2(true)
  };
  const handleExpandClick = (mealId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [mealId]: !prevExpanded[mealId],
    }));
  };

  const handleClose2 = () => setOpen2(false);

  useEffect(() => {
    getMealPlanAPICall(childId);
    setLoading(false);
  }, [childId]);


  const addMeal = async (obj) => {
    await mealPlanSetAPICall(obj, childId)
    handleClose();
  }

  const deleteMeal = async (mealId) => {
    await delMealAPICall(mealId);
    setOpen2(false);
    await getMealPlanAPICall(childId);
  }

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
<<<<<<< HEAD
=======
            subheader={meal.time}
>>>>>>> 2b2bce60876221731b9abf9a9fd0c86f05747f42
          />
          <CardMedia
            component="img"
            height="200"
            image={mealPlanImage}
          />
          <CardActions disableSpacing>
            <IconButton onClick={() => handleOpen2(meal && meal._id)} color='textSecondary' aria-label="Delete Vaccine">
              <DeleteIcon />
            </IconButton>
            <Button variant="contained"
              color="success"
              expand={expanded}
              // onClick={handleExpandClick}
              onClick={() => handleExpandClick(meal._id)}
              aria-expanded={expanded[meal._id]}
              aria-label="show more"
            >
              Directions

              <ExpandMoreIcon />
            </Button>
          </CardActions>
          <Collapse in={expanded[meal._id]} timeout="auto"
            unmountOnExit>
            <CardContent>
              <Typography sx={{ color: 'black' }}>
                {meal.directions}
              </Typography>

            </CardContent>
          </Collapse>
        </Card>
      </Grid >
    )
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
    // } else if (error) {
    //   return (<div>
    //     Error here
    //   </div>
    //   );
  } else {
    return (
      <div>
        <br />
        <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
          Add Meal
        </Button>
        <br />
        <br />
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
        {open2 && <DeleteMealModal
          open={open2}
          onClose={handleClose2}
          _id={deleteId}
          deleteMeal={deleteMeal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />}
        {open && <AddMealModal
          open={open}
          onClose={handleClose}
          childId={childId}
          addMeal={addMeal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    mealData: state.meals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMealPlanAPICall: (childId) => dispatch(getMealPlanAPICall(childId)),
    mealPlanSetAPICall: (obj, childId) => dispatch(mealPlanSetAPICall(obj, childId)),
    delMealAPICall: (mealId) => dispatch(delMealAPICall(mealId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MealList);
