import React, { useState, useEffect } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';
import { getDashboardLandingAPICall } from '../redux/dashboardLanding/dashboardLandingActions'
import childImage from '../img/childImage.png'

const DashboardLanding = ({ getDashboardLandingAPICall, childData }) => {
    console.log(childData, "data aagaya")
    const regex = /(<([^>]+)>)/gi;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([])
    let { nannyId } = useParams();
    let card = null;
  
    useEffect(() => {
      async function fetchData() {
        try {
          getDashboardLandingAPICall(nannyId)
          setLoading(false);
          setError(false);
        } catch (e) {
          setLoading(false);
          setError(true);
          console.log(e);
        }
      }
      if (nannyId != undefined) { fetchData() }
    }, [nannyId]);
  
    const buildCard = (child) => {
      return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={child}>
           <Link to = {`/dashboard/${child}`}>
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
              title={child}
            //     subheader={vaccines.date}
            />
            <CardMedia
              component="img"
              height="194"
              image={childImage}
            />
            <CardActions disableSpacing>
           
  
              {/* <IconButton onClick={() => handleOpen} color='error' aria-label="Add Vaccine">
                          <FavoriteIcon />
                      </IconButton> */}
            </CardActions>

          </Card>
          </Link>
        </Grid >
  
      );
    };
  
  
    card =
      childData &&
      childData.data &&
      childData.data.n_childIds &&
      childData.data.n_childIds.map((child) => {
        if (child !== null) {
          return buildCard(child);
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
      childData: state.dashboardLanding
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      getDashboardLandingAPICall: (nannyId) => dispatch(getDashboardLandingAPICall(nannyId)),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardLanding);