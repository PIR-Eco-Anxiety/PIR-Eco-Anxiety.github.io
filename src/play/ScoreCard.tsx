import { Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function ScoreCard({score}: {score: number}) {
  let photo;
  let text;
  if (score < 50) {
    photo = "https://i1.wp.com/www.middleeastmonitor.com/wp-content/uploads/2017/03/2008_1-Industrial-Zone.jpg";
    text = "Business as usual.";
  } else if (score < 100) {
    photo = "https://www.usnews.com/cmsmedia/86/34/71a79ae847a499cba726d89b962a/190522-citiesoh-stock.jpg";
    text = "C'est pas trop mal.";
  } else if (score < 150) {
    photo = "https://www.refinedglobalrecruitment.com/wp-content/uploads/sites/60/2023/05/Green-Sustainable-Building.jpeg";
    text = "La planete va plutot bien!";
  } else {
    photo = "https://ideas.ted.com/wp-content/uploads/sites/3/2017/07/featured_art_15509682524_85a6c8200d_o.jpg";
    text = "Super travail!!";
  }

  return (
    <Card sx={{
      width: "80%",
      aspectRatio: "4/3",
      ml: "auto",
      mr: "auto",
      mb: 4,
      mt: 4,
      position: "relative",
      borderRadius: 2,
      // For the gradient overlay:
      "&:after": {
        content: '""',
        display: "block",
        position: "absolute",
        width: "100%",
        height: "64%",
        bottom: 0,
        zIndex: 1,
        background: "linear-gradient(to top, #000, rgba(0,0,0,0))",
      },
    }}>
      <CardMedia
        image={photo}
        sx={{
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundPosition: "0% 70%",
          position: "absolute",
          filter: "brightness(80%)",
          zIndex: 0,
        }}
      />
      <CardContent sx={{
        zIndex: 2,
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 4,
        color: "white",
      }}>
        <Typography variant="h2" sx={{ zIndex: 2 }}>Score: {score}</Typography>
        <Typography variant="subtitle1" sx={{ zIndex: 2 }}>{text}</Typography> 
      </CardContent>
    </Card>
  );
}