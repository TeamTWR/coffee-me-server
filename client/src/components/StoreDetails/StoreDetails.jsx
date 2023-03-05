import "./details_styles.css";
import useDetails from "../../hooks/useDetails";
import { useParams } from "react-router-dom";
import ImageSlider from "../ImageSlider/ImageSlider";
import CheckIcon from "@mui/icons-material/Check";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import { Stack } from "@mui/system";
import { Loading } from "../Loading/Loading";
import { LocationContext } from "../../context/LocationContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { Drawer, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { Reviews } from "../Reviews/Reviews";

const mapsBaseURL = "https://www.google.com/maps/dir/";

const getNavigationURL = (userlocation, storeLocation) => {
  return `${mapsBaseURL}${
    userlocation.location.address
      ? userlocation.location.address
      : "My Location"
  }/@${userlocation.location.lat},${userlocation.location.lng}/${
    storeLocation.address
  }`;
};

export const StoreDetails = () => {
  const { storeId } = useParams();
  const { data, loading, error } = useDetails(storeId);

  const authContext = useContext(AuthContext);
  const locationContext = useContext(LocationContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [currentModal, setCurrentModal] = useState("");
  const handleSwitchModal = (modalName) => {
    setCurrentModal(modalName);
  };

  if (error) {
    console.log(error);
  }

  if (loading || locationContext.loading) {
    return <Loading />;
  }

  return (
    <div className="storeDetails-container">
      <div className="slider-image">
        <ImageSlider images={data.images} />
      </div>
      <Stack direction="row">
        <h1 id="details-title" width="80%">
          {data.name}
        </h1>
        <div className="fav-btn">
          {authContext.loggedIn && <FavoriteButton store={data} />}
        </div>
      </Stack>
      <div className="address-container">
        <a
          href={getNavigationURL(locationContext.settings, data.location)}
          id="address"
        >
          {data.location.address}
        </a>
      </div>
      <div className="rate">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Rating
            name="customized-color"
            value={data.rating}
            getLabelText={(value) => `${value} Cup${value !== 1 ? "s" : ""}`}
            precision={0.5}
            icon={<FreeBreakfastIcon fontSize="inherit" />}
            emptyIcon={<FreeBreakfastOutlinedIcon fontSize="inherit" />}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#685618",
              },
            }}
          />
          <Box sx={{ ml: 1 }}>{data.rating}</Box>
        </Box>
      </div>
      <Grid container sx={{ ml: "5%" }}>
        {data.delivery && (
          <Grid item xs={4}>
            <div className="drive-thru-container">
              <div id="check-image">
                <CheckIcon />
              </div>
              <p id="drive-thru">Delivery</p>
            </div>
          </Grid>
        )}
        {data.curbsidePickup && (
          <Grid item xs={8}>
            <div className="drive-thru-container">
              <div id="check-image-2">
                <CheckIcon />
              </div>
              <p id="curbside">Curbside Pickup</p>
            </div>
          </Grid>
        )}
      </Grid>

      <div className="time-container">
        {data.openingHours &&
          data.openingHours.map((hours, i) => (
            <div key={i}>
              <p className="day">{hours}</p>
            </div>
          ))}
      </div>
      <div className="details-container">
        <p id="details-text">
          {data.description ? data.description : "No description available"}
        </p>
      </div>

      <>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={() => setIsDrawerOpen(true)}
        >
          <div className="review-btn-container">
            <button id="reviews-btn" disabled={!data?.reviews?.length}>
              {data?.reviews?.length} Reviews
            </button>
          </div>
        </IconButton>
        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <div className="review-title-container">
            <h1 id="top-title">Reviews</h1>
          </div>
          <Box
            p={2}
            bgcolor="#D9BBA9"
            overflow="auto"
            height="400px"
            width="358px"
            textAlign="center"
            role="presentation"
          >
            <Typography variant="h6" component="div">
              {data?.reviews?.length &&
                data.reviews.map((review) => (
                  <div
                    className="review-container-slider"
                    key={review.timestamp}
                  >
                    <div className="title-container">
                      <h1 id="review-name">{review.user.username}</h1>
                      <h3 id="review-rating">{review.rating}</h3>
                    </div>
                    <div className="text-container">
                      <p id="review-text">{review.text}</p>
                    </div>
                  </div>
                ))}
            </Typography>
          </Box>
        </Drawer>
      </>
      {authContext.loggedIn && (
        <button id="reviews-btn2" onClick={() => handleSwitchModal("review")}>
          <RateReviewIcon
            sx={{
              "& .MuiRating-iconFilled": {
                color: "white",
              },
            }}
          />
        </button>
      )}
      {currentModal === "review" && (
        <Reviews handleSwitchModal={handleSwitchModal} />
      )}
    </div>
  );
};
