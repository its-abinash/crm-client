import React, { useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import Button from "@material-ui/core/Button";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardFooter from "../../components/Card/CardFooter.js";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Col, Row } from "react-bootstrap";
import * as MainUtils from "../../main_utils/main_utils"

const useStyles = makeStyles(styles);

var getGitHubIssues = async function (type, server = true) {
  const _RestUtil = new MainUtils.RestUtil();
  var URL = server
    ? "https://api.github.com/repos/AbinashB1997/CRM/issues"
    : "https://api.github.com/repos/AbinashB1997/crm-client/issues";
  var callOptions = {
    method: "GET",
    url: URL,
    headers: { Accept: "application/vnd.github.v3+json" },
    timeout: 60 * 1000,
    params: { state: type },
  };
  var data = await _RestUtil.makeRequest(callOptions);
  return data.getRestData();
};

function GetIssueCount(props) {
  return (
    <>
      <a
        href={
          props.type === "open"
            ? "https://github.com/AbinashB1997/CRM/issues?q=is:open"
            : "https://github.com/AbinashB1997/CRM/issues?q=is:closed"
        }
      >
        {props.serverIssues}
      </a>{" "}
      :{" "}
      <a
        href={
          props.type === "open"
            ? "https://github.com/AbinashB1997/crm-client/issues?q=is:open"
            : "https://github.com/AbinashB1997/crm-client/issues?q=is:closed"
        }
      >
        {props.ClientIssues}{" "}
      </a>
    </>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  var [activeServerIssues, SetActiveServerIssues] = useState("-");
  var [closedServerIssues, SetClosedServerIssues] = useState("-");
  var [activeClientIssues, SetActiveClientIssues] = useState("-");
  var [closedClientIssues, SetClosedClientIssues] = useState("-");
  var [issueCardColor, SetIssueCardColor] = useState("danger");
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color={issueCardColor} stats icon>
              <CardIcon color={issueCardColor}>
                {issueCardColor === "danger" && <ErrorOutlineIcon />}
                {issueCardColor === "success" && <DoneOutlineIcon />}
              </CardIcon>
              <p className={classes.cardCategory}>
                {issueCardColor === "danger"
                  ? "Active Issues"
                  : "Closed Issues"}
              </p>
              <h3 className={classes.cardTitle}>
                {issueCardColor === "danger" && (
                  <GetIssueCount
                    type="open"
                    serverIssues={activeServerIssues}
                    ClientIssues={activeClientIssues}
                  />
                )}
                {issueCardColor === "success" && (
                  <GetIssueCount
                    type="closed"
                    serverIssues={closedServerIssues}
                    ClientIssues={closedClientIssues}
                  />
                )}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <Row>
                <Col xs="auto">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={async function () {
                      var serverIssues = await getGitHubIssues("open", true);
                      var clientIssues = await getGitHubIssues("open", false);
                      SetActiveServerIssues(serverIssues.length);
                      SetActiveClientIssues(clientIssues.length);
                      SetIssueCardColor("danger");
                    }}
                  >
                    Active Issue
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={async function () {
                      var serverIssues = await getGitHubIssues("closed", true);
                      var clientIssues = await getGitHubIssues("closed", false);
                      SetClosedClientIssues(clientIssues.length);
                      SetClosedServerIssues(serverIssues.length);
                      SetIssueCardColor("success");
                    }}
                  >
                    Closed Issue
                  </Button>
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Followers</p>
              <h3 className={classes.cardTitle}>+245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
