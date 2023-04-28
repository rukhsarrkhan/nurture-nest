import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardHeader } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { getApplicantAPICall } from '../redux/jobs/jobActions';
import '../App.css';

let noImage = "noImage"

const Event = (props) => {

  const  job  = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setError] = useState(true);
  // const classes = useStyles();
  let {jobId,applicantId} = useParams();

  const tConvert = (time) => {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };
  const formatDate = (showdate) => {
    var year = showdate.substring(0, 4);
    var month = showdate.substring(5, 7);
    var day = showdate.substring(8, 10);
    return month + '/' + day + '/' + year;
  };


  useEffect(() => {
      try{
        console.log("1st use effect fired",jobId)
        if (applicantId && jobId){dispatch(getApplicantAPICall(jobId,applicantId))}    
      } catch (e) {
        setError(true)
        setLoading(false)
        console.log(e);
      }
  }, [jobId,applicantId]);


  useEffect(() => {
    console.log("2nd use effect fired",job)
    try{
      if(job){
        setShowData(showData);
        setLoading(false);
        setError(false)
      }else{
        setError(true)
        setLoading(false)
    }}catch(e){
      console.log(e)
      setError(true)
      setLoading(false)
    }
  },[job])

  let summary = null;
  const regex = /(<([^>]+)>)/gi;
  if (showData && showData.summary) {
    summary = showData && showData.summary.replace(regex, '');
  } else {
    summary = 'No Summary';
  }

  if (loading) {
    if(errorMsg){
      return (
        <div>
          <h2>Error404: No data found</h2>
        </div>
      );
    }
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }else if(errorMsg){
    return (
      <div>
        <h2>Error404: No data found</h2>
      </div>
    );
  } else {
    return (
      <Card
        variant='outlined'
        sx={{
          maxWidth: 1000,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardHeader
          title={showData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            showData.images && showData.images[0].url
              ? showData.images[0].url
              : noImage
          }
          title='show image'
        />

        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid #1e8678',
              fontWeight: 'bold'
            }}
          >
            <dl>
            <p>
                <dt className='title'>ID: </dt>
                {showData && showData.id ? (<dd>{showData.id}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Price range: </dt>
                {showData && showData.priceRanges ? (<dd>{showData.priceRanges[0].min+" "+showData.priceRanges[0].currency+' to '+showData.priceRanges[0].max+" "+showData.priceRanges[0].currency}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Start Date: </dt>
                {showData && showData.dates.start.localDate ? (<dd>{formatDate(showData.dates.start.localDate)}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Sale Start Date: </dt>
                {showData && showData.sales && showData.sales.public && showData.sales.public.startDateTime ? (<dd>{formatDate(showData.sales.public.startDateTime)}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Sale End Date: </dt>
                {showData && showData.sales && showData.sales.public && showData.sales.public.endDateTime ? (<dd>{formatDate(showData.sales.public.endDateTime)}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Promoter: </dt>
                {showData && showData.promoter ? (<dd>{showData.promoter.name}</dd>) : (<dd>N/A</dd>)}
              </p>
              <p>
                <dt className='title'>Seat Map: </dt>
                {showData && showData.seatmap && showData.seatmap.staticUrl ? (<dd>{showData.seatmap.staticUrl}</dd>) : (<dd>N/A</dd>)}
              </p>
              {/* <p>
                <dt className='title'>Offical Site:</dt>
                {showData && showData.officialSite ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={showData.officialSite}
                    >
                      {showData.name} Offical Site
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Network:</dt>
                {showData && showData.network ? (
                  <dd>{showData.network && showData.network.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Language:</dt>
                {showData && showData.language ? (
                  <dd>{showData.language}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Runtime:</dt>
                {showData && showData.runtime ? (
                  <dd>{showData.runtime + ' Min'}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Premiered:</dt>
                {showData && showData.premiered ? (
                  <dd>{formatDate(showData.premiered)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Country:</dt>
                {showData &&
                showData.network &&
                showData.network.country.name ? (
                  <dd>{showData.network.country.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Time Zone:</dt>
                {showData &&
                showData.network &&
                showData.network.country.timezone ? (
                  <dd>{showData.network.country.timezone}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Airtime:</dt>
                {showData && showData.schedule.time ? (
                  <dd>{tConvert(showData.schedule.time)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Days Aired:</dt>
                {showData &&
                showData.schedule.days &&
                showData.schedule.days.length >= 1 ? (
                  <span>
                    {showData.schedule.days.map((day) => {
                      if (showData.schedule.days.length > 1)
                        return <dd key={day}>{day}s,</dd>;
                      return <dd key={day}>{day}s</dd>;
                    })}
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Status:</dt>
                {showData && showData.status ? (
                  <dd>{showData.status}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
                <dt className='title'>Genres:</dt>
                {showData && showData.genres && showData.genres.length >= 1 ? (
                  <span>
                    {showData.genres.map((genre) => {
                      if (showData.genres.length > 1)
                        return <dd key={genre}>{genre},</dd>;
                      return <dd key={genre}>{genre}</dd>;
                    })}
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Summary:</dt>
                <dd>{summary}</dd>
              </p> */}
            </dl>
            <img src={showData.seatmap.staticUrl}></img>
            <Link to='/events/page/1'>Back to all events...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Event;
