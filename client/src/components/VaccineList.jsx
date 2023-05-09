import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from '@mui/material';
import '../App.css';
import { getVaccineAPICall } from '../redux/vaccines/vaccineActions';
import { vaccineSetAPICall } from '../redux/vaccines/vaccineActions';
import { delVaccineAPICall } from '../redux/vaccines/vaccineActions';
import AddIcon from '@mui/icons-material/Add';
import DeleteModal from './modals/DeleteVaccineModal';
import Button from '@mui/material/Button';
import image from '../img/vaccineimage.png';
import AddModal from './modals/AddVaccineModal';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { AuthContext } from '../firebase/Auth';
import { Navigate } from "react-router-dom";
import ErrorPage from '../components/ErrorPage';

const VaccineList = ({ getVaccineAPICall, vaccineSetAPICall, vaccineData, delVaccineAPICall, userData }) => {
    // NO CONSOLE ERRORS
    // LOADING MISSING
    // ERRORS MISSING
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
        getVaccineAPICall(childId);
        setLoading(false);
    }, [childId]);

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => setOpen(false);

    const handleOpen2 = (id) => {
        setDeleteId(id);
        setOpen2(true);
    };

    const handleClose2 = () => setOpen2(false);

    useEffect(() => {
        if (vaccineData !== undefined) {
            if (vaccineData?.error !== "") {
                setErrorPage(true);
                setErrorText(vaccineData?.error?.error?.message);
                setErrorCode(vaccineData?.error?.error?.statusCode);
            }
        }
    }, [vaccineData]);


    const addVaccine = async (obj) => {
        await vaccineSetAPICall(obj, childId);
        handleClose();
    };

    const deleteVaccine = async (vaccineId) => {
        await delVaccineAPICall(vaccineId);
        setOpen2(false);
        await getVaccineAPICall(childId);
    };

    const buildCard = (vaccines) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={vaccines && vaccines?._id}>
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
                        title={vaccines?.name}
                        subheader={vaccines?.date}
                    />
                    <CardMedia
                        component="img"
                        height="194"
                        alt='Vaccine'
                        image={image}
                    />
                    <CardActions disableSpacing>
                        {userData?.data?.profile === "PARENT" ? (
                            <IconButton onClick={() => handleOpen2(vaccines && vaccines?._id)} color='textSecondary' aria-label="Delete Vaccine">
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </CardActions>
                </Card>
            </Grid >

        );
    };

    card =
        vaccineData &&
        vaccineData?.data &&
        vaccineData?.data?.map((vaccines) => {
            if (vaccines !== null) {
                return buildCard(vaccines);

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
                            Add Vaccine
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

                    {open2 && <DeleteModal
                        open={open2}
                        onClose={handleClose2}
                        _id={deleteId}
                        deleteVaccine={deleteVaccine}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />}
                    {open && <AddModal
                        open={open}
                        onClose={handleClose}
                        childId={childId}
                        addVaccine={addVaccine}
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
        vaccineData: state?.vaccines
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getVaccineAPICall: (childId) => dispatch(getVaccineAPICall(childId)),
        vaccineSetAPICall: (obj, childId) => dispatch(vaccineSetAPICall(obj, childId)),
        delVaccineAPICall: (vaccineId) => dispatch(delVaccineAPICall(vaccineId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VaccineList);
