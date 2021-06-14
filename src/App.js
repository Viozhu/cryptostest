import React, { useState, useEffect } from "react";
import { Divider, Grid, Button } from "@material-ui/core";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Nav from "./Nav";
import "./f.css";

const useStyles = makeStyles({
  white: {
    background: "#ffffff",
    color: "#000000",
    width: "100%",
  },
  black: {
    background: "#000000",
    color: "#ffffff",
    width: "100%",
  },
  root: {
    minWidth: 275,
    background:
      "linear-gradient(90deg, rgba(203,201,237,1) 0%, rgba(0,212,255,1) 100%)",
  },
  bullet: {
    display: "flex",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  rooto: { display: "flex", flexDirection: "row", flexGrow: 1 },
});

export default function App() {
  const [state, setstate] = useState([]);
  const [theme, setTheme] = useState("");

  const cambio = () => {
    theme === classes.black ? setTheme(classes.white) : setTheme(classes.black);
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      const info = async () => {
        const res = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr"
        );
        setstate(res.data);
      };
      info();
    }, 3000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  const filterCrypto = state?.filter((x) => x.symbol.slice(0, 3) === "BTC");

  const data = {
    labels: filterCrypto.slice(0, 7).map((x) => x.symbol),
    datasets: [
      {
        label: "# of Votes",
        data: filterCrypto.slice(0, 7).map((x) => x.highPrice),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    animation: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
        },
      ],
    },
  };

  const classes = useStyles();

  return (
    <div className={theme}>
      <Nav />
      <Button onClick={cambio} color="primary" variant="contained">
        DarkMode
      </Button>
      <Line data={data} options={options} width="200" height="50" />
      <Grid
        className={classes.rooto}
        container
        spacing={1}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {state &&
          filterCrypto.slice(0, 7).map((s) => (
            <Grid item xs={3}>
              <Card className={classes.root} color="secondary">
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    align="center"
                  >
                    {s.symbol.replace("BTC", "BTC ~ ")}
                  </Typography>
                  <Divider variant="middle" />

                  <Typography variant="body2" component="p" align="center">
                    Hight Price $ {s.highPrice} <br />
                    Low Price $ {s.lowPrice}
                    <br />
                    Count ~ {s.count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
