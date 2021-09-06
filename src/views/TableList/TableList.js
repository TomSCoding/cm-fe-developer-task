import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Check from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";

import { fetchDataFromServer } from "./api.js";

//import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

// Data
import hrData from "assets/data/HR.json";

const useStyles = makeStyles(styles);

// Add a checked field to each department object for checkbox state
const addCheckBoxFieldToJSON = (json_data) => {
  return json_data.departments.map((obj) => ({
    ...obj,
    checked: false,
  }));
};

// Reset checkfield boxes to default when a click occurs to select only one field at a time
const resetCheckBoxes = (deps) => {
  return deps.map((obj) => ({
    ...obj,
    checked: false,
  }));
};

const TableList = () => {
  const [departments, setDepartments] = useState([]);
  const [randomUserData, setRandomUserData] = useState([]);

  useEffect(async () => {
    // Check if departments exists in session storage, if not load it in from the HR.json file.
    if ("selectedDepartment" in sessionStorage) {
      // If user had made a prevoius selection in the current session load from session storage
      setDepartments(JSON.parse(sessionStorage.getItem("departments")));
      // Get data from api based on department
      const apiData = await fetchDataFromServer(
        sessionStorage.getItem("selectedDepartment")
      );
      // Set the initial api response data
      setRandomUserData(apiData);
    } else {
      // If the user has not selected any values yet load from JSON file
      setDepartments(addCheckBoxFieldToJSON(hrData));
    }
  }, []);

  // Handle Checkbox Select
  const handleCheck = async (index) => {
    // Make a copy of the department array and reset the checkboxes
    var depCopy = resetCheckBoxes(departments);
    // Flip the state to check or uncheck the check box
    depCopy[index].checked = !depCopy[index].checked;
    // Update the selected department in session storage
    sessionStorage.setItem(
      "selectedDepartment",
      depCopy[index].department.toString()
    );

    // Update the department list
    setDepartments(depCopy);
    // Write selected checkboxes to session storage
    sessionStorage.setItem("departments", JSON.stringify(depCopy));
    // Get data from api
    const apiData = await fetchDataFromServer(depCopy[index].department);
    // Update the api data result variable
    setRandomUserData(apiData);
  };

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Departments</h4>
              <p className={classes.cardCategoryWhite}>List of Departments</p>
            </CardHeader>
            <CardBody>
              {departments ? (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCellClasses}>
                        ID
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Location
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Department
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Managers First Name
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Managers Last Name
                      </TableCell>
                      <TableCell
                        className={classes.tableCellClasses}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments &&
                      departments.map((obj, index) => (
                        <TableRow key={index} className={classes.tableRow}>
                          <TableCell>{obj.id.toString()}</TableCell>
                          <TableCell>{obj.location}</TableCell>
                          <TableCell>{obj.department}</TableCell>
                          <TableCell>{obj.manager.name.first}</TableCell>
                          <TableCell>{obj.manager.name.last}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={obj.checked}
                              onClick={() => handleCheck(index)}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              icon={<Check className={classes.uncheckedIcon} />}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                "Loading..."
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Result Table</h4>
                <p className={classes.cardCategoryWhite}>
                  Result Table for{" "}
                  {sessionStorage.getItem("selectedDepartment")} Department
                </p>
              </div>
            </CardHeader>
            <CardBody>
              {randomUserData ? (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCellClasses}>
                        First Name
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Last Name
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Nationality
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Email
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Gender
                      </TableCell>
                      <TableCell className={classes.tableCellClasses}>
                        Phone
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {randomUserData &&
                      randomUserData.map((obj, index) => (
                        <TableRow key={index} className={classes.tableRow}>
                          <TableCell>{obj.name.first}</TableCell>
                          <TableCell>{obj.name.last}</TableCell>
                          <TableCell>{obj.nat}</TableCell>
                          <TableCell>{obj.email}</TableCell>
                          <TableCell>{obj.gender}</TableCell>
                          <TableCell>{obj.phone}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                "No Results To Show"
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default TableList;
