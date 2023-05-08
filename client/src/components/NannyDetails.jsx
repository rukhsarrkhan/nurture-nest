import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import Loading from './Loading';
import {
  Card,
  CardMedia,
  Grid,
  CardActionArea,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { getNannyDetailsAPICall } from '../redux/nannyDetails/nannyDetailsActions';
import { useLocation } from 'react-router-dom';

const NannyDetails = ({ getNannyDetailsAPICall, nannyData }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let { nannyId } = useParams();
  let childData = location.state.childId;

  useEffect(() => {
    async function fetchData() {
      try {
        getNannyDetailsAPICall(childData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (childData !== undefined) { fetchData(); }
  }, [childData]);


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
    return (
      <div>
        Error here
      </div>
    );
  } else {
    return (
      <div>
        <br></br>
        <br></br>
        <Button
          variant="contained"
          onClick={() => { navigate(-1); }}
          sx={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'block'
          }}
        >
          Back
        </Button>
        <br></br>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={7} md={5} lg={4} xl={6} key={nannyData?.firstName?.toString()}>
            <Card sx={{ maxWidth: 600, borderRadius: 16 }}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  height='200'
                  alt=''
                  image={nannyData?.photoUrl}
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
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
                  >
                    {nannyData && nannyData.name
                      ? 'Name: ' + nannyData?.name
                      : 'Name: No data to display'}
                    <br />
                    {nannyData && nannyData.contact
                      ? 'Contact: ' + nannyData?.contact
                      : 'Contact: No data to display'}
                    <br />
                    {nannyData && nannyData.city
                      ? 'City: ' + nannyData?.city
                      : 'City: No data to display'}
                    <br />
                    {nannyData && nannyData.city
                      ? 'State: ' + nannyData?.state
                      : 'State: No data to display'}
                    {nannyData && nannyData.address
                      ? 'Address: ' + nannyData?.address
                      : 'Address: No data to display'}
                    <br />
                    {nannyData && nannyData.distance
                      ? 'Distance: ' + nannyData?.distance
                      : 'Distance: No data to display'}
                    <br />
                    {nannyData && nannyData.disability
                      ? 'Disability: ' + nannyData?.distance
                      : 'Disability: No data to display'}
                    <br />
                    {nannyData && nannyData.experience
                      ? 'Experience: ' + nannyData?.experience
                      : 'Experience: No data to display'}
                    <br />
                    {nannyData && nannyData.punctuality
                      ? 'Punctuality: ' + nannyData?.punctuality
                      : 'Punctuality: No data to display'}
                    <br />
                    {nannyData && nannyData.attachment
                      ? 'Attachments: ' + nannyData?.attachment
                      : 'Attachments: No data to display'}
                    <br />
                    {nannyData && nannyData.reasonToSelect
                      ? 'Reason To Select: ' + nannyData?.reasonToSelect
                      : 'Reason To Select: No data to display'}
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
    nannyData: state?.nanny?.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getNannyDetailsAPICall: (nannyId, childId) => dispatch(getNannyDetailsAPICall(nannyId, childId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NannyDetails);
