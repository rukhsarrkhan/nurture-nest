import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from "@mui/icons-material/Delete"
import { Grid } from '@mui/material';
import '../App.css';
import { getAppointmentAPICall } from '../redux/appointments/appointmentActions';
import { appointmentSetAPICall } from '../redux/appointments/appointmentActions';
import AddIcon from '@mui/icons-material/Add';
import DeleteAppointmentModal from './modals/DeleteAppointmentModal';
import Button from '@mui/material/Button';

import image from '../img/appointmentImage.png'
import AddAppointmentModal from './modals/AddAppointmentModal';
import { delAppointmentAPICall } from '../redux/appointments/appointmentActions';

const submitButton = {
    position: 'absolute',
    right: '5%',
    top: '95%',
    width: 40,
    height: 40,
    borderRadius: 10,
}

const AppointmentList = ({ getAppointmentAPICall, appointmentSetAPICall, appointmentData, delAppointmentAPICall }) => {
    let card = null
    let { childId } = useParams();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorPage, setErrorPage] = useState(false)
    const [deleteId, setDeleteId] = useState('')

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => setOpen(false);

    const handleOpen2 = (id) => {
        setDeleteId(id)
        setOpen2(true)
    };
    const handleClose2 = () => setOpen2(false);

    useEffect(() => {
        getAppointmentAPICall(childId);
        setLoading(false);
    }, [childId]);

    const addAppointment = async (obj) => {
        await appointmentSetAPICall(obj, childId)
        handleClose();
    }

    const deleteAppointment = async (appointmentId) => {
        await delAppointmentAPICall(appointmentId);
        setOpen2(false);
        await getAppointmentAPICall(childId);
    }

    const buildCard = (appointments) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={appointments && appointments._id}>
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
                        title={appointments.doctor}
                        subheader={appointments.hospital}
                    />
                    <CardMedia
                        component="img"
                        height="194"
                        image={image}
                    />
                    <CardActions disableSpacing>
                        <IconButton onClick={() => handleOpen2(appointments && appointments._id)} color='textSecondary' aria-label="Delete Appointment">
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </Grid >

        );
    };


    card =
        appointmentData &&
        appointmentData.data &&
        appointmentData.data.map((appointments) => {
            if (appointments !== null) {
                return buildCard(appointments);

            }
        });

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
        // } else if (error) {
        //     return (
        //         <div>
        //             <h2>Error 404: No data for this page</h2>
        //         </div>
        //     );

    } else {
        return (
            <div>
                <div>
                    <br />
                    <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
                        Add Appointment
                    </Button>
                    <br />
                    <br />
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

                    {open2 && <DeleteAppointmentModal
                        open={open2}
                        onClose={handleClose2}
                        _id={deleteId}
                        deleteAppointment={deleteAppointment}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
                    {open && <AddAppointmentModal
                        open={open}
                        onClose={handleClose}
                        addAppointment={addAppointment}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
                </div>
                <br />
                <br />

            </div>

        );
    }
};

const mapStateToProps = state => {
    return {
        userData: state.users,
        appointmentData: state.appointments

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAppointmentAPICall: (childId) => dispatch(getAppointmentAPICall(childId)),
        appointmentSetAPICall: (obj, childId) => dispatch(appointmentSetAPICall(obj, childId)),
        delAppointmentAPICall: (appointmentId) => dispatch(delAppointmentAPICall(appointmentId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppointmentList);
