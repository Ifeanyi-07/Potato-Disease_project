import { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActionArea, CardMedia, Grid, Button, CircularProgress } from "@material-ui/core";
// import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';




const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);
// const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    minHeight: 500,
    height: "auto",
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#be6a77',
    boxShadow: 'none',
    color: 'white'
  },
  loader: {
    color: '#be6a77 !important',
  },
  resultCard: {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "15px",
  padding: "18px 20px",
  width: "100%",
  boxSizing: "border-box",
  display: "block",
  },

  resultTitle: {
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
    marginBottom: "5px",
    fontWeight: 600,
  },

  diseaseName: {
    fontSize: "26px",
    color: "#be6a77",
    textAlign: "center",
    fontWeight: 900,
    marginBottom: "15px",
  },

  confidenceLabel: {
    fontSize: "14px",
    color: "#555",
    fontWeight: 700,
    marginBottom: "6px",
  },

  confidenceBarBackground: {
  width: "100%",
  height: "10px",
  backgroundColor: "#e5e5e5",
  borderRadius: "10px",
  overflow: "hidden",
  display: "block",
  },

  confidenceBar: {
    height: "10px",
    backgroundColor: "#be6a77",
    borderRadius: "10px",
    display: "block",
  },

  confidenceValue: {
    fontSize: "22px",
    color: "#be6a77",
    textAlign: "center",
    fontWeight: 900,
    marginTop: "8px",
  },

  loadingText: {
    marginTop: "10px",
    color: "#be6a77",
    fontWeight: 700,
  },

}));

const formatDiseaseName = (disease) => {
  if (!disease) return "";

  return disease
    .replace("Potato___", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;


  const sendFile = useCallback(async () => {
    if (!image || !selectedFile) {
      return;
    }

    try {
      setIsloading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });

      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error(
        "Prediction error:",
        error.response?.data || error.message
      );
    } finally {
      setIsloading(false);
    }
  }, [image, selectedFile]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);


  useEffect(() => {
    if (!preview) {
        return;
    }

    setIsloading(true);
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence)).toFixed(2);
    // confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
          {/* <Avatar src={cblogo}></Avatar> */}
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="img"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                  onChange={onSelectFile}
                />
              </CardContent>}
            {data && !isLoading && (
                <CardContent className={classes.resultCard}>
                  <Typography className={classes.resultTitle}>
                    Prediction
                  </Typography>

                  <Typography className={classes.diseaseName}>
                    {formatDiseaseName(data.class)}
                  </Typography>

                  <Typography className={classes.confidenceLabel}>
                    Confidence
                  </Typography>

                  <div className={classes.confidenceBarBackground}>
                    <div
                      className={classes.confidenceBar}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>

                  <Typography className={classes.confidenceValue}>
                    {confidence}%
                  </Typography>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress
                    color="secondary"
                    className={classes.loader}
                    size={45}
                  />

                  <Typography className={classes.loadingText}>
                    Analyzing potato leaf...
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data &&
            <Grid item className={classes.buttonGrid} >

              <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear
              </ColorButton>
            </Grid>}
        </Grid >
      </Container >
    </React.Fragment >
  );
};
