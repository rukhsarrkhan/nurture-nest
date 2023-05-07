import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { Card, CardMedia, Grid, Button, CardActionArea, CardContent, Typography } from "@mui/material";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";
import AddIcon from "@mui/icons-material/Add";
import childImage from "../img/childImage.png";
import AddChildModal from "./modals/AddChildModal";
import { createChildAPICall, setChildSuccess, setChildFailure, fetchChildrenAPICall } from "../redux/child/childActions";
import { setUserProfileAPICall } from "../redux/users/userActions";

const Home = ({ userData, childData, id, createChildAPICall, setUserProfileAPICall, fetchChildrenAPICall }) => {
    const [userObjData, setuserObjData] = useState(undefined);
    const [childObjArr, setChildObjArr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [modalOpen, setModalOpen] = useState(false); // new state to control modal visibility
    let card = null;
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            try {
                await setUserProfileAPICall(id);
            } catch (e) {
                setuserObjData(undefined);
                setLoading(false);
                setError(true);
                setErrorText(e.message ? e.message : e);
            }
        }
        async function fetchChildData() {
            try {
                await fetchChildrenAPICall(id);
            } catch (e) {
                setChildObjArr([]);
                setLoading(false);
                setError(true);
                setErrorText(e.message ? e.message : e);
            }
        }
        if (id !== undefined && userData.userProfile === null) {
            fetchData();
            fetchChildData();
        }
        if (userData.userProfile) {
            setuserObjData(userData.userProfile);
            setLoading(false);
        }
    }, [id, setUserProfileAPICall, userData, fetchChildrenAPICall]);
    useEffect(() => {
        if (childData) {
            setChildObjArr(childData);
        }
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
                                    component="h2"
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
                                    {child?.age}
                                </Typography>
                                <br />
                                <Typography
                                    variant="body3"
                                    color="textSecondary"
                                    component="span"
                                    sx={{
                                        borderBottom: "1px solid #1e8678",
                                        color: "#000000",
                                    }}
                                >
                                    {child?.sex}
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
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

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };
    const addChildApiCallAndClose = async (obj) => {
        await createChildAPICall(obj);
        handleModalClose();
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
                {userObjData?.profile === "PARENT" && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddChildClick}>
                        Add Child
                    </Button>
                )}
                {/* <AddChildModal open={modalOpen} onClose={handleModalClose} /> */}
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        flexDirection: "row",
                    }}
                >
                    {card}
                </Grid>
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
        setUserProfileAPICall: (id) => dispatch(setUserProfileAPICall(id)),
        createChildAPICall: (obj) => dispatch(createChildAPICall(obj)),
        fetchChildrenAPICall: (id) => dispatch(fetchChildrenAPICall(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
