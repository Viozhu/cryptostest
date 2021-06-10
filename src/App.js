import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Nav from "./Nav";

const useStyles = makeStyles({
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
});

export default function App() {
  const [state, setstate] = useState([]);

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
    <div>
      <Nav />
      <Line data={data} options={options} width="200" height="50" />
      <Grid container spacing={1}>
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
