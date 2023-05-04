import React, { useState, useEffect } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardMedia,
  Grid,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';
import { getNannyDetailsAPICall } from '../redux/nannyDetails/nannyDetailsActions';

const NannyDetails = ({ getNannyDetailsAPICall, nannyData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { nannyId } = useParams();
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        getNannyDetailsAPICall(nannyId);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (nannyId !== undefined) { fetchData(); }
  }, [nannyId]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        Error here
      </div>
    );
  } else {
    return (
      <div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={nannyData?.firstName?.toString()}>
            <Card sx={{ maxWidth: 345, borderRadius: 16 }}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  height='200'
                  alt=''
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant='h5'
                    component='div'
                    sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
                  >
                    Nanny Details
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                    {nannyData && nannyData.firstName
                      ? "First Name: " + nannyData.firstName
                      : "First Name: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.lastName
                      ? "Last Name: " + nannyData.lastName
                      : "Last Name: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.email
                      ? "Email: " + nannyData.email
                      : "Email: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.age
                      ? "Age: " + nannyData.age
                      : "Age: " + 'No data to display'}
                    <br />
                    {nannyData && nannyData.address
                      ? "Address: " + nannyData.address
                      : "Address: " + 'No data to display'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  };
};

const mapStateToProps = state => {

  return {
    nannyData: state.nanny.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getNannyDetailsAPICall: (nannyId) => dispatch(getNannyDetailsAPICall(nannyId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NannyDetails);
