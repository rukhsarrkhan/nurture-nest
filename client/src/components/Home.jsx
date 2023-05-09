import React, { useState, useEffect, useContext, useMemo } from "react";
import "../App.css";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Card, CardMedia, Grid, Button, CardActionArea, CardContent, Typography } from "@mui/material";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";
import AddIcon from "@mui/icons-material/Add";
import childImage from "../img/childImage.png";
import AddChildModal from "./modals/AddChildModal";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { createChildAPICall, fetchChildrenAPICall, deleteChilDAPICall } from "../redux/child/childActions";
import DeleteChildModal from "./modals/DeleteChildModal";

const Home = ({ userData, childData, setUserProfileAPICall, createChildAPICall, fetchChildrenAPICall, deleteChilDAPICall }) => {
    // NO CONSOLE ERRORS
    // LOADING MISSING
    // ERRORS MISSING
    const [userObjData, setuserObjData] = useState(userData?.data);
    const [childObjArr, setChildObjArr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [redirectProfile, setRedirectProfile] = useState(false);
    let card = null;

    const { currentUser } = useContext(AuthContext);

    const id = userData?.data?._id;

    const setUserProfileAPICallMemo = useMemo(() => {
        return () => {
            try {
                if (currentUser && id) setUserProfileAPICall(id);
            } catch (error) {
                setuserObjData(undefined);
                setLoading(false);
                setErrorText(error.message ? error.message : error);
            }
        };
    }, [id, setUserProfileAPICall, currentUser]);

    useEffect(() => {
        const clearLocalStorage = () => {
            alert("Session Expired. Signing out now.");
            doSignOut();
        };
        const timeoutId = setTimeout(clearLocalStorage, 3600000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        setUserProfileAPICallMemo();
    }, [setUserProfileAPICallMemo]);

    useEffect(() => {
        if (userData?.data && currentUser) {
            setuserObjData(userData?.data);
            fetchChildrenAPICall(userData?.data?._id);
        }
    }, [userData, fetchChildrenAPICall, currentUser]);
    useEffect(() => {
        if (userObjData) {
            if (userObjData?.profile === undefined || userObjData?.profile === null || userObjData?.profile === "") {
                setRedirectProfile(true);
            } else {
                setRedirectProfile(false);
            }
        }
    }, [userObjData]);

    useEffect(() => {
        setChildObjArr(childData);
        setLoading(false);
    }, [childData]);

    const buildCard = (child) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={child?._id}>
                <Card
                    variant="outlined"
                    sx={{
                        maxWidth: 345,
                        height: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 5,
                        boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
                    }}
                >
                    <CardActionArea>
                        <Link to={`/dashboard/${child?._id}`}>
                            <CardMedia
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                }}
                                component="img"
                                image={child?.photoUrl ? child?.photoUrl : childImage}
                                title="show image"
                            />

                            <CardContent>
                                <Typography
                                    sx={{
                                        borderBottom: "1px solid #1e8678",
                                        fontWeight: "bold",
                                        color: "#000000",
                                    }}
                                    gutterBottom
                                    variant="h6"
                                    component="h1"
                                >
                                    {child?.name}
                                </Typography>
                                <Typography
                                    variant="body3"
                                    color="textSecondary"
                                    component="span"
                                    sx={{
                                        borderBottom: "1px solid #1e8678",
                                        color: "#000000",
                                    }}
                                >
                                    <dl>
                                        <p>
                                            <dt className="title">Age: </dt>
                                            {child?.age ? <dd>{child?.age}</dd> : <dd>N/A</dd>}
                                        </p>
                                        <p>
                                            <dt className="title">Sex: </dt>
                                            {child?.sex ? <dd>{child?.sex}</dd> : <dd>N/A</dd>}
                                        </p>
                                    </dl>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                    {userObjData?.profile === "PARENT" ? (
                        <IconButton onClick={() => handleOpen2(child?._id)} color="textSecondary" aria-label="Delete Child">
                            <DeleteIcon sx={{ position: "absolute", bottom: 0, right: 150 }} />
                        </IconButton>
                    ) : null}
                </Card>
            </Grid>
        );
    };

    card =
        childObjArr &&
        childObjArr.length > 0 &&
        childObjArr.map((child) => {
            return buildCard(child);
        });

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const addChildApiCallAndClose = async (obj) => {
        await createChildAPICall(obj);
        handleModalClose();
    };

    const handleOpen2 = (id) => {
        setDeleteId(id);
        setOpen2(true);
    };

    const handleClose2 = () => setOpen2(false);

    const deleteChild = async (childId) => {
        await deleteChilDAPICall(childId, userObjData);
        setOpen2(false);
        await fetchChildrenAPICall(id);
    };

    const handleAddChildClick = () => {
        setModalOpen(true);
    };

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    if (redirectProfile) {
        return <Navigate to="/setProfile" />;
    }

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    } else if (error) {
        return <div>Error here</div>;
    } else {
        return (
            <div>
                <br />
                {userObjData?.profile === "PARENT" && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddChildClick}>
                        Add Child
                    </Button>
                )}
                <br />
                <br />
                {userObjData?.profile === "PARENT" ? (
                    childObjArr.length === 0 ? (
                        <Typography
                            variant="p"
                            component="p"
                            sx={{
                                backgroundColor: "#fcebeb",
                                color: "#333",
                                padding: "10px",
                                borderRadius: "5px",
                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                                marginBottom: "20px",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            No child found for this parent
                        </Typography>
                    ) : (
                        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
                            {card}
                        </Grid>
                    )
                ) : userObjData?.profile === "NANNY" ? (
                    <Typography
                        variant="p"
                        component="p"
                        sx={{
                            backgroundColor: "#fcebeb",
                            color: "#333",
                            padding: "10px",
                            borderRadius: "5px",
                            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                            marginBottom: "20px",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        No child has been assigned to this Nanny yet
                    </Typography>
                ) : (
                    <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
                        {card}
                    </Grid>
                )}
                {modalOpen && (
                    <AddChildModal
                        open={modalOpen}
                        onClose={handleModalClose}
                        addChild={addChildApiCallAndClose}
                        parentId={id}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />
                )}
                {open2 && (
                    <DeleteChildModal
                        open={open2}
                        onClose={handleClose2}
                        _id={deleteId}
                        deleteChild={deleteChild}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    />
                )}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        userData: state.users,
        childData: state.child.childObjs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createChildAPICall: (obj) => dispatch(createChildAPICall(obj)),
        fetchChildrenAPICall: (id) => dispatch(fetchChildrenAPICall(id)),
        deleteChilDAPICall: (childId, obj) => dispatch(deleteChilDAPICall(childId, obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
