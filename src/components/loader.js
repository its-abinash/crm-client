import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import React from "react";

export default function Loader(props) {
  var { isOpen } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isOpen}
    >
      <CircularProgress color="inherit" size="4rem" />
    </Backdrop>
  );
}
