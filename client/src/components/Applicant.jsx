import React, {useState, useEffect} from 'react';
import {Link, useParams,useLocation,useNavigate} from 'react-router-dom';
import { Card, CardContent,CardActions, CardMedia, Typography, CardHeader } from '@mui/material';
import Avatar from "@mui/material/Avatar";
import { purple } from "@mui/material/colors";
import SelectNanny from './modals/SelectNanny';
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from 'react-redux';
import '../App.css';
import Container from "@mui/material/Container";
import Box, { BoxProps } from '@mui/material/Box';
import { selectNannyAPICall } from '../redux/jobs/jobActions';


const Application = ({ job, selectNannyAPICall }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(props, "yaha dekhleee")
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setError] = useState(true);
 
  console.log(location.state,"appID heree")
  let application = location.state.application
  let jobId = location.state.jobId

  const [selectNannyModal, setSelectNannyModal] = React.useState(false);
  const handleOpenSelectNanny = () => setSelectNannyModal(true);
  const handleCloseSelectNanny = () => setSelectNannyModal(false);

  const selectNanny = async (jobId,nannyId) => {
    console.log("something is hapenning",jobId,nannyId)
    selectNannyAPICall(jobId,nannyId);
    setSelectNannyModal(false);
}


  useEffect(() => {
    console.log("1st use effect fired")
    try{
      if(application){
        setShowData(application);
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
  },[])


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
    const date = new Date(showData?.applyDate.toLocaleString("en-US", {timeZone: "America/New_York",hour: "numeric",minute: "numeric"}));
    const formattedDate = date.toLocaleString("en-US", {year: "numeric",month: "long",day: "numeric",hour: "numeric",minute: "numeric",second: "numeric",hour12: false});
    return (
      <Container sx={{ justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 700 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
            {showData?.nannyName[0]}
          </Avatar>
        }
        title={showData?.nannyName}
        subheader={formattedDate}
      />
      <CardMedia
        component="img"
        height="194"
        image="https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2023/03_29_revuelto/gate_models_s_02_m.jpg"
        alt="Nanny Image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {showData?._id}
        </Typography>
      </CardContent>
      <CardContent>
      <div style={{ display: "flex" }}>
        <Typography paragraph>Why Mee:</Typography>
        <Typography paragraph  sx={{paddingLeft:"7px"}}>
          {showData?.whySelect}
        </Typography>
        </div>

        <div style={{ display: "flex" }}>
        <Typography paragraph>Experience</Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.experience}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography paragraph>
          Cover Letter:
        </Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.attachment}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography paragraph>
          Disability:
        </Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.disability}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography paragraph>
          Shift Punctuality:
        </Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.shiftPuntuality}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography paragraph>
          My Address:
        </Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.nannyAddress}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography paragraph>
          How far do I stay:
        </Typography>
        <Typography paragraph sx={{paddingLeft:"7px"}}>
          {showData?.distance}
        </Typography>
        </div>
        <Button onClick={handleOpenSelectNanny} variant="filled" sx={{bgcolor:purple[700]}}>Select this Nanny for Job</Button>
{selectNannyModal && <SelectNanny
                        open={selectNannyModal}
                        onClose={handleCloseSelectNanny}
                        jobId={jobId}
                        nannyId={showData?.nannyId}
                        nannyName={showData?.nannyName}
                        selectNanny={selectNanny}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
        
      </CardContent>
    </Card>
    <Button  onClick={() => {navigate(-1)}} variant="filled" sx={{bgcolor:purple[700]}}>Back</Button>	
    </Container>
    );
  }
};

const mapStateToProps = state => {
  return {
    job: state.jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectNannyAPICall: (jobId,nannyId) => dispatch(selectNannyAPICall(jobId,nannyId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);


// export default Application;
