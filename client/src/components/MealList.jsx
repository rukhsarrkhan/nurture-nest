import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import { mealPlanSetAPICall } from '../redux/mealplans/mealPlanActions';
import { delMealAPICall } from '../redux/mealplans/mealPlanActions';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AuthContext } from '../firebase/Auth';
import Loading from './Loading';
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
import ErrorPage from '../components/ErrorPage';


const MealList = ({ getMealPlanAPICall, mealData, mealPlanSetAPICall, delMealAPICall, userData }) => {
  // NO CONSOLE ERRORS
  // LOADING MISSING
  // ERRORS MISSING
  // REMOVE PARAMS

  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  let { childId } = useParams();
  let card = null;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (currentUser) {
      setErrorPage(false);
      getMealPlanAPICall(childId);
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    if (mealData !== undefined) {
      setLoading(false);
      if (mealData?.error !== "") {
        setErrorPage(true);
        setErrorText(mealData?.error);
        setErrorCode(mealData?.code);
      }
    }
  }, [mealData]);

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => setOpen(false);

  const handleOpen2 = (id) => {
    setDeleteId(id);
    setOpen2(true);
  };

  const handleExpandClick = (mealId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [mealId]: !prevExpanded[mealId],
    }));
  };

  const handleClose2 = () => setOpen2(false);

  const addMeal = async (obj) => {
    await mealPlanSetAPICall(obj, childId);
    handleClose();
  };

  const deleteMeal = async (mealId) => {
    await delMealAPICall(mealId);
    setOpen2(false);
    await getMealPlanAPICall(childId);
  };

  const buildCard = (meal) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={meal?._id}>
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
            title={meal?.meal}
            subheader={meal?.time}
          />
          <CardMedia
            component="img"
            height="200"
            alt='Meal Plan'
            image={mealPlanImage}
          />
          <CardActions disableSpacing>
            {userData?.data?.profile === "PARENT" ? (
              <IconButton onClick={() => handleOpen2(meal && meal?._id)} color='textSecondary' aria-label="Delete Vaccine">
                <DeleteIcon />
              </IconButton>
            ) : null}
            <Button variant="contained"
              color="success"
              expand={expanded}
              onClick={() => handleExpandClick(meal?._id)}
              aria-expanded={expanded[meal?._id]}
              aria-label="show more"
            >
              Directions
              <ExpandMoreIcon />
            </Button>
          </CardActions>
          <Collapse in={expanded[meal?._id]} timeout="auto"
            unmountOnExit>
            <CardContent>
              <Typography sx={{ color: 'black' }}>
                {meal?.directions}
              </Typography>

            </CardContent>
          </Collapse>
        </Card>
      </Grid >
    );
  };

  card =
    mealData &&
    mealData?.data &&
    mealData?.data?.map((meal) => {
      if (meal !== null) {
        return buildCard(meal);
      }
    });

  if (!currentUser) {
    return <Navigate to='/' />;
  }

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (errorPage) {
    return (
      <div>
        <ErrorPage error={errorText} code={errorCode} />
      </div>
    );
  } else {
    return (
      <div>
        <br />
        {userData?.data?.profile === "PARENT" ? (
          <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
            Add Meal
          </Button>
        ) : null}

        <Button variant="contained" onClick={() => { navigate(-1); }} sx={{ marginLeft: '10px' }}>

          Back
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
};

const mapStateToProps = state => {
  return {
    mealData: state?.meals,
    userData: state.users,

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
