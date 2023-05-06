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
import Loading from './Loading';


const Application = ({ job, selectNannyAPICall }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(props, "yaha dekhleee")
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
 
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
      setErrorMsg(e)
      setError(true)
      setLoading(false)
    }
  },[])


  if (loading) {
    return (
      <div>
        <Loading/>
      </div>
    );
  }else if(error){
    return (
      <div>
        <h2>{errorMsg}</h2>
      </div>
    );
  } else {
    function getEDTTimeFromISOString(dateString) {
      const date = new Date(dateString);
      const options = { timeZone: 'America/New_York', hour12: true };
      return date.toLocaleString('en-US', options);
    }
    return (
      <Container sx={{ justifyContent: 'center' }}>
        <Button  onClick={() => {navigate(-1)}} variant="filled" sx={{bgcolor:purple[700]}}>Back</Button>	<br/><br/>
      <Card sx={{ maxWidth:'50%',marginLeft:"25%",marginRight:"25%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
            {showData?.nannyName[0]}
          </Avatar>
        }
        title={showData?.nannyName}
        subheader={`Applied to job on ${getEDTTimeFromISOString(showData?.applyDate)}`}
      />
      <CardMedia
        component="img"
        height="50%"
        width="50%"
        image="https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2023/03_29_revuelto/gate_models_s_02_m.jpg"
        alt="Nanny Image"
      />
      <CardContent>
      </CardContent>
      <CardContent>
      <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>Why Mee:</Typography>
        <Typography color="text.secondary" paragraph  sx={{paddingLeft:"7px"}}>
          {showData?.whySelect}
        </Typography>
        </div>

        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>Experience</Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.experience}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>
          Cover Letter:
        </Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.attachment}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>
          Disability:
        </Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.disability}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>
          Shift Punctuality:
        </Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.shiftPuntuality}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>
          My Address:
        </Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.nannyAddress}
        </Typography>
        </div>
        <div style={{ display: "flex" }}>
        <Typography color="text.secondary" fontWeight="bold" paragraph>
          How far do I stay:
        </Typography>
        <Typography color="text.secondary" paragraph sx={{paddingLeft:"7px"}}>
          {showData?.distance}
        </Typography>
        </div>
        
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
    <br/>
    <Button onClick={handleOpenSelectNanny} variant="filled" sx={{bgcolor:purple[700]}}>Select this Nanny for Job</Button>
    <br/>
    <br/>
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
