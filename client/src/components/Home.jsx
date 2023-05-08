import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Card, CardMedia, Grid, Button, CardActionArea, CardContent, Typography } from "@mui/material";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";
import AddIcon from "@mui/icons-material/Add";
import childImage from "../img/childImage.png";
import AddChildModal from "./modals/AddChildModal";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { createChildAPICall, fetchChildrenAPICall, deleteChilDAPICall } from "../redux/child/childActions";
import { setUserProfileAPICall } from "../redux/users/userActions";
import DeleteChildModal from "./modals/DeleteChildModal";

const Home = ({ userData, childData, createChildAPICall, setUserProfileAPICall, fetchChildrenAPICall, deleteChilDAPICall }) => {
    const [userObjData, setuserObjData] = useState(userData?.userProfile);
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
    console.log(currentUser, " Current user in home");

    const id = userData?.userProfile?._id;

    useEffect(() => {
        if (userData?.userProfile) {
            setuserObjData(userData?.userProfile);
            fetchChildrenAPICall(userData.userProfile._id);
        }
    }, [userData, fetchChildrenAPICall]);
    useEffect(() => {
        setChildObjArr(childData);
        setLoading(false);
    }, [childData]);

    useEffect(() => {
        if (userObjData) {
            if (userObjData?.profile === undefined || userObjData?.profile === null || userObjData?.profile === "") {
                setRedirectProfile(true);
            } else {
                setRedirectProfile(false);
            }
        }
    }, [userObjData]);

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    if (redirectProfile) {
        return <Navigate to="/setProfile" />;
    }

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
                            <IconButton onClick={() => handleOpen2(child?._id)} color='textSecondary' aria-label="Delete Child" >
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

    if (!currentUser) {
        return <Navigate to="/" />;
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
        const handleAddChildClick = () => {
            setModalOpen(true);
        };
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
                {childObjArr.length === 0 ? (
                    <Typography variant="h1" component="h2">
                        No children found
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
    console.log(state, " State here");
    return {
        userData: state.users,
        childData: state.child.childObjs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUserProfileAPICall: (id) => dispatch(setUserProfileAPICall(id)),
        createChildAPICall: (obj) => dispatch(createChildAPICall(obj)),
        fetchChildrenAPICall: (id) => dispatch(fetchChildrenAPICall(id)),
        deleteChilDAPICall: (childId, obj) => dispatch(deleteChilDAPICall(childId, obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
