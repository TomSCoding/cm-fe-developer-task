import axios from "axios";

// Get and return data from api
export const fetchDataFromServer = async (department) => {
  try {
    // Make get request to api
    var res = await axios
      .get(`https://randomuser.me/api/?seed=${department}&results=6`)
      .catch((error) => console.log(error));
    // Check if the api returned a 2XX response
    if (199 < res.status && res.status < 300) {
      // Return data from server
      return res.data.results;
    } else {
      console.log(
        "Error non 2XX response from API, Response Code = " +
          res.status.toString()
      );
    }
  } catch (err) {
    console.log(err);
  }
};
