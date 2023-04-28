import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SearchApplicants from "./SearchApplicants";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showAllApplicantsAPICall } from "../redux/jobs/jobActions";
import { searchApplicantsAPICall } from "../redux/jobs/jobActions";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import Container from "@mui/material/Container";
import "../App.css";

let noImage = "noImage";

const EventList = () => {
  let { jobId, pageNum } = useParams();

  const job = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setError] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextButton, setLastButton] = useState(true);
  let card = null;
  let pagenum = pageNum;

  useEffect(() => {
    try {
      console.log("1st use effect fired", jobId, pageNum);
      if (pagenum) {
        dispatch(showAllApplicantsAPICall(jobId, pageNum));
      }
    } catch (e) {
      console.log("error===>", e);
      setError(true);
      setLoading(false);
    }
  }, [pageNum, jobId]);

  useEffect(() => {
    console.log("2nd use effect fired", job);
    try {
      if (job.data) {
        setShowsData(job.applicantsData);
        console.log("showsData is set to:",showsData," with job from dispatch:",job);
        setLoading(false);
        setError(false);
      }
    } catch (e) {
      console.log(e);
      setError(true);
      setLoading(false);
    }
  }, [job]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("search use effect fired", jobId, pageNum);
        if (pagenum) {
          dispatch(searchApplicantsAPICall(jobId, searchTerm, pageNum));
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (show) => {
    const date = new Date(
      show.applyDate.toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
      })
    );
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    console.log(show);
    return (
      // <Container fixed maxWidth="70%">
      <Grid item xs={12} key={show.id} sx={{ justifyContent: "center" }}>
        <Card
          sx={{
            maxWidth: "70%",
            maxHeight: 300,
            paddingRight: 0,
            marginLeft: "15%",
            marginRight: "15%",
            position: "relative",
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12} sm={4}>
              <CardMedia
                component="img"
                height="100%"
                width={100}
                image="https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2023/03_29_revuelto/gate_models_s_02_m.jpg"
                alt="Paella dish"
              />
            </Grid>
            <Grid item xs={12} sm={8} sx={{ paddingLeft: "20px" }}>
              <CardContent>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: purple[700] }} aria-label="recipe">
                        {show.nannyName[0]}
                      </Avatar>
                    }
                    title={show.nannyName}
                    subheader={`Applied to job on ${formattedDate}`}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Why me:
                  </Typography>
                  <Typography paragraph>{show.whySelect}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ paddingRight: "10px" }}
                  >
                    Experience:
                  </Typography>
                  <Typography>
                    {show.experience.length > 200
                      ? show.experience.substring(0, 200) + " ..."
                      : show.experience}
                  </Typography>
                </div>
              </CardContent>
              <CardActions
                disableSpacing
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                <Button variant="contained" sx={{ bgcolor: purple[700] }}>
                  Select
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      // </Container>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        console.log("coming here")
        return buildCard(shows);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }




  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (errorMsg) {
    return (
      <div>
        <h2>Error404: No data found</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchApplicants searchValue={searchValue} />
        <br />
        <br />
        <Grid container spacing={2} sx={{ flexGrow: 1, flexDirection: "row" }}>
          {card}
        </Grid>
        <br />
        <br />
        {pagenum > 1 && (
          <Link
            className="showlink"
            to={`/job/${jobId}/allApplicants/${pagenum - 1}`}
          >
            Previous
          </Link>
        )}
        {nextButton && (
          <Link
            className="showlink"
            to={`/job/${jobId}/allApplicants/${parseInt(pagenum) + 1}`}
          >
            Next
          </Link>
        )}
      </div>
    );
  }
};

export default EventList;
