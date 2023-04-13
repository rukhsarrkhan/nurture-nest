import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import SearchShows from './SearchApplicants';
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { showAllApplicantsAPICall } from '../redux/jobs/jobActions';
// import '../App.css';

let noImage = "noImage"

const EventList = () => {

  let { jobId,pageNum } = useParams();

  const  job  = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setError] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextButton, setLastButton] = useState(true)
  let card = null;
  let pagenum = pageNum

  useEffect(() => {
  try{
    console.log("1st use effect fired",jobId,pageNum)
    if (pagenum){dispatch(showAllApplicantsAPICall(jobId,pageNum))}
  }catch(e){
    console.log("error===>",e)
    setError(true)
    setLoading(false)
  }
}, [pageNum,jobId]);

useEffect(() => {
  console.log("2nd use effect fired",job)
  try{
    if(job.data){
  setShowsData(job.applicantsData);
  console.log("showsData is set to:",showsData," with job from dispatch:",job)
  setLoading(false)
  setError(false)}
}catch(e){
  console.log(e)
  setError(true)
  setLoading(false)
}
}, [job]);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get('https://app.ticketmaster.com/discovery/v2/events?countryCode=US&apikey=1FMcv2w0dhUmzk7IdoRGJGuA8FdVM7Dq&locale=*&keyword=' + searchTerm);
        setSearchData(data._embedded.events);
        setLoading(false);
      } catch (e) {console.log(e)}}
    if (searchTerm){fetchData()}
  }, [searchTerm]);

  const searchValue = async (value) => { setSearchTerm(value) };

  const buildCard = (show) => {
    return (
      <Grid item xs={12} key={show.id}>
        <Card variant='outlined' sx={{maxWidth:1300,height: 'auto',marginLeft: 'auto',marginRight: 'auto',borderRadius: 5,border: '1px solid #1e8678',boxShadow:'0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'}}>
          <CardActionArea>
            <Link to={`/events/${show.id}`}>
              <CardMedia sx={{ height: '100%', width: '100%'}} component='img' image={show.images && show.images[0].url? show.images[0].url: noImage} title='show image' />
              <CardContent>
                <Typography sx={{ borderBottom: '1px solid #1e8678', fontWeight: 'bold'}} gutterBottom variant='h6' component='h2' >
                  {show.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {show && show.nannyName ? 'Name: '+show.nannyName:'No name'}<br/>
                  {show && show.expectedSalary ? 'Expected Salary: '+show.expectedSalary :'Not Disclosed'}<br/>
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card = searchData && searchData.map((shows) => {return buildCard(shows)});
  } else {
    card = showsData && showsData.map((show) => {return buildCard(show)});
  }

  if (loading) { return ( <div><h2>Loading....</h2></div>);
  } else if(errorMsg){ return (<div><h2>Error404: No data found</h2></div>);
  } else{
    return (
      <div>
        <SearchShows searchValue={searchValue} /><br /><br />
        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: 'row'}} >
          {card}
        </Grid><br/><br/>
        {pagenum>1 && <Link className='showlink' to={`/job/${jobId}/allApplicants/${pagenum-1}`}>Previous</Link>}
        {nextButton && <Link className='showlink' to={`/job/${jobId}/allApplicants/${parseInt(pagenum)+1}`}>Next</Link>}
      </div>
    );
  }
};

export default EventList;
