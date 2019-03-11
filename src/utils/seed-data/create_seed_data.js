const faker = require("faker");
const jsonfile = require("jsonfile");

const numPlaces = 10;
const usersPerPlace = 3;

const pdata = [];
const udata = [];

const offlineUserInfo = {
  handle: "me",
  userID: "offlineContext_cognitoIdentityId",
  firstName: "tester",
  lastName: "tester",
  location: "the Universe",
  description: "the curious explorer",
  favourites: []
};

udata.push(offlineUserInfo);

const handlePlaceNames = [];

faker.seed(1000);

for (let i = 0; i < numPlaces; i += 1) {
  handlePlaceNames.push(faker.company.companyName());
}

for (let i = 0; i < handlePlaceNames.length; i += 1) {
  const placeId = faker.random.uuid();
  const placeInfo = {
    placeID: placeId,
    city: faker.address.city(),
    upvoteCount: i,
    addedBy: offlineUserInfo.userID
  };
  pdata.push(placeInfo);

  for (let j = 0; j < usersPerPlace; j += 1) {
    const favourites = [placeId];

    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const location = faker.address.city();
    const description = faker.name.jobTitle();

    const handle = faker.internet.userName();
    const userID = faker.random.uuid();
    const userInfo = {
      handle,
      userID,
      firstName,
      lastName,
      location,
      description,
      favourites
    };

    udata.push(userInfo);
  }
}

const ufile = "Users.json";
const pfile = "Places.json";

jsonfile.writeFileSync(ufile, udata);

jsonfile.writeFileSync(pfile, pdata);
