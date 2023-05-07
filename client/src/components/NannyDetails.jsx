import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import Loading from './Loading';
import {
  Card,
  CardMedia,
  Grid,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';
import { getNannyDetailsAPICall } from '../redux/nannyDetails/nannyDetailsActions';
import { useLocation } from 'react-router-dom';

const NannyDetails = ({ getNannyDetailsAPICall, nannyData, id }) => {

  const location = useLocation();
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeChild, setActiveChild] = useState("");
  let { nannyId } = useParams();
  let card = null;
  let childData = location.state.childId;
  useEffect(() => {
    async function fetchData() {
      try {
        getNannyDetailsAPICall(nannyId, childData);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    if (nannyId !== undefined) { fetchData(); }
  }, [nannyId]);


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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={7} md={5} lg={4} xl={6} key={nannyData?.firstName?.toString()}>
            <Card sx={{ maxWidth: 600, borderRadius: 16 }}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  height='200'
                  alt=''
                  image={nannyData?.image}
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
                    {nannyData && nannyData.firstName
                      ? 'First Name: ' + nannyData?.firstName
                      : 'First Name: No data to display'}
                    <br />
                    {nannyData && nannyData.lastName
                      ? 'Last Name: ' + nannyData?.lastName
                      : 'Last Name: No data to display'}
                    <br />
                    {nannyData && nannyData.email
                      ? 'Email: ' + nannyData?.email
                      : 'Email: No data to display'}
                    <br />
                    {nannyData && nannyData.age
                      ? 'Age: ' + nannyData?.age
                      : 'Age: No data to display'}
                    <br />
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
