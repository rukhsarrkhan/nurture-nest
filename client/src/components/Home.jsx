import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { Link, Navigate } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import {
  Card,
  CardMedia,
  Grid
} from '@mui/material';
import { AuthContext } from '../firebase/Auth';
import { gethomeAPICall } from '../redux/home/homeActions';
import childImage from '../img/childImage.png';
import Loading from './Loading';

const Home = ({ gethomeAPICall, childData, id }) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let card = null;
  const { currentUser } = useContext(AuthContext);
  console.log("currentUser", currentUser);

  useEffect(() => {
    async function fetchData() {
      try {
        gethomeAPICall(id);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (id !== undefined) { fetchData(); }
  }, [id]);

  const buildCard = (child) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={child}>
        <Link to={`/dashboard/${child}`}>
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
              title={child}
            />
            <CardMedia
              component="img"
              height="194"
              image={childImage}
            />
            <CardActions disableSpacing>
            </CardActions>

          </Card>
        </Link>
      </Grid >
    );
  };

  card =
    childData?.data?.n_childIds?.map((child) => {
      if (child !== null) {
        return buildCard(child);
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
    childData: state?.home
  };
};

const mapDispatchToProps = dispatch => {
  return {
    gethomeAPICall: (id) => dispatch(gethomeAPICall(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
