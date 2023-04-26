import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createJobAPICall } from "../redux/jobs/jobActions";
import { deleteJobAPICall } from "../redux/jobs/jobActions";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { pink, purple } from "@mui/material/colors";
import helpers from "../helpers";
import allStates from "../allStates";
import CreateJobModal from "./modals/CreateJobModal";
import DeleteJobModal from "./modals/DeleteJobModal";



const CreateJob = ({ jobData, userRegistrationAPICall }) => {
  const { job } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  // Modal states
  const [openCreateJobModal, setOpenCreateJobModal] = React.useState(false);
  const handleOpenCreateJob = () => setOpenCreateJobModal(true);
  const handleCloseCreateJob = () => setOpenCreateJobModal(false);

  const [openDeleteJobModal, setOpenDeleteJobModal] = React.useState(false);
  const handleOpenDeleteJob = () => setOpenDeleteJobModal(true);
  const handleCloseDeleteJob = () => setOpenDeleteJobModal(false);

  const createJob = async (data,parentId,childId) => {
    dispatch(createJobAPICall(data,parentId,childId));
    // handleCloseCreateJob();    //this is needed and is only temporarily commented
  };

const deleteJob = async (jobId) => {
    dispatch(deleteJobAPICall(jobId));
    setOpenDeleteJobModal(false);
}
  return (<div>
    <Button onClick={handleOpenCreateJob} variant="filled" sx={{bgcolor:purple[700]}}>Create Job</Button>
    {openCreateJobModal && <CreateJobModal
                        open={openCreateJobModal}
                        onClose={handleCloseCreateJob}
                        parentId={"64386551d23cae6776e82cc1"}
                        childId={"642920ef07dd90f433291af2"}
                        createJob={createJob}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
    />}
<Button onClick={handleOpenDeleteJob} variant="filled" sx={{bgcolor:purple[700]}}>Delete Job</Button>
{openDeleteJobModal && <DeleteJobModal
                        open={openDeleteJobModal}
                        onClose={handleCloseDeleteJob}
                        jobId={"6448ce40bd5ef32520ff0a84"}
                        deleteJob={deleteJob}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
  </div>);
};

export default CreateJob;
