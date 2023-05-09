import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from '@mui/material';
import '../App.css';
import { getAppointmentAPICall } from '../redux/appointments/appointmentActions';
import { appointmentSetAPICall } from '../redux/appointments/appointmentActions';
import AddIcon from '@mui/icons-material/Add';
import DeleteAppointmentModal from './modals/DeleteAppointmentModal';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import image from '../img/appointmentImage.png';
import AddAppointmentModal from './modals/AddAppointmentModal';
import { delAppointmentAPICall } from '../redux/appointments/appointmentActions';
import Loading from './Loading';
import { AuthContext } from '../firebase/Auth';
import ErrorPage from '../components/ErrorPage';

const AppointmentList = ({ getAppointmentAPICall, appointmentSetAPICall, appointmentData, delAppointmentAPICall, userData }) => {
    // NO CONSOLE ERRORS
    // LOADING MISSING
    // REMOVE PARAMS

    const { currentUser } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorPage, setErrorPage] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [errorText, setErrorText] = useState("");
    const [errorCode, setErrorCode] = useState("");

    let card = null;
    let { childId } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        if (appointmentData !== undefined) {
            if (appointmentData?.error !== "") {
                setErrorPage(true);
                setErrorText(appointmentData?.error);
                setErrorCode(appointmentData?.code);
            }
        }
    }, [appointmentData]);

    useEffect(() => {
        getAppointmentAPICall(childId);
        setLoading(false);
    }, [childId]);

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => setOpen(false);

    const handleOpen2 = (id) => {
        setDeleteId(id);
        setOpen2(true);
    };
    const handleClose2 = () => setOpen2(false);


    const addAppointment = async (obj) => {
        await appointmentSetAPICall(obj, childId);
        handleClose();
    };

    const deleteAppointment = async (appointmentId) => {
        await delAppointmentAPICall(appointmentId);
        setOpen2(false);
        await getAppointmentAPICall(childId);
    };

    const buildCard = (appointments) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={appointments && appointments?._id}>
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
                        title={appointments?.doctor}
                        subheader={" At " + appointments?.hospital + " On " + appointments?.date}
                    />
                    <CardMedia
                        component="img"
                        height="194"
                        alt='Appointment'
                        image={image}
                    />
                    <CardActions disableSpacing>
                        {userData?.data?.profile === "PARENT" ? (
                            <IconButton onClick={() => handleOpen2(appointments && appointments?._id)} color='textSecondary' aria-label="Delete Vaccine">
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </CardActions>
                </Card>
            </Grid >

        );
    };

    card =
        appointmentData &&
        appointmentData?.data &&
        appointmentData?.data?.map((appointments) => {
            if (appointments !== null) {
                return buildCard(appointments);

            }
        });


    if (!currentUser) {
        return <Navigate to='/' />;
    }
    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    } else if (errorPage) {
        return (
            <div>
                <ErrorPage error={errorText} code={errorCode} />
            </div>
        );
    } else {
        return (
            <div>
                <div>
                    <br />
                    {userData?.data?.profile === "PARENT" ? (
                        <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
                            Add Appointment
                        </Button>
                    ) : null}
                    <Button variant="contained" onClick={() => { navigate(-1); }} sx={{ marginLeft: '10px' }}>
                        Back
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
        userData: state?.users,
        appointmentData: state?.appointments,
        userData: state?.users,
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
