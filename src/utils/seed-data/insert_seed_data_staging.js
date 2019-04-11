/* eslint-disable no-unused-vars */
// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

const allUsers = JSON.parse(fs.readFileSync("Users.json", "utf8"));
const allPlaces = JSON.parse(fs.readFileSync("Places.json", "utf8"));

allUsers.forEach(user => {
  const Userparams = {
    TableName: "Users",
    Item: {
      handle: user.handle,
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: user.description,
      likes:
        user.likes && user.likes.length > 0
          ? docClient.createSet(user.likes)
          : undefined
    }
  };

  docClient.put(Userparams, (err, _data) => {
    if (err) {
      console.error(
        "Unable to add user",
        user.firstName,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", user.firstName);
    }
  });
});

allPlaces.forEach(place => {
  const Placeparams = {
    TableName: "Places",
    Item: {
      placeID: place.placeID,
      city: place.city,
      upvoteCount: place.upvoteCount,
      likers:
        place.likers && place.likers.length > 0
          ? docClient.createSet(place.likers)
          : undefined
    }
  };

  docClient.put(Placeparams, (err, data) => {
    if (err) {
      console.error(
        "Unable to add tweet",
        place.placeID,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", place.placeID);
    }
  });
});
