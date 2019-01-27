const faker = require("faker");
const jsonfile = require("jsonfile");

const numPlaces = 10;
const usersPerPlace = 3;
const reviewsPerUser = 5

const udata = [];
const rdata = [];
const pdata = [];

const handlePlaceNames = [];

faker.seed(1000);

for (let i = 0; i < numPlaces; i++) {
  handlePlaceNames.push(faker.company.companyName());
}

for (let i = 0; i < handlePlaceNames.length; i++) {
  const place_id = faker.random.uuid();
  const placeInfo = {
    place_id: place_id,
    name: faker.company.companyName(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    rank: i,
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    created_at: faker.date.between("2016-01-01", "2017-01-27")
  };
  pdata.push(placeInfo);

  for (let i = 0; i < usersPerPlace; i++) {
    const favourites = [place_id];

    const name = faker.name.findName();
    const location = faker.address.city();
    const description = faker.name.jobTitle();

    const userId = faker.internet.userName();
    const userInfo = {
      handle: userId,
      name: name,
      location: location,
      description: description,
      favourites: favourites
    };

    udata.push(userInfo);

    for (let j = 0; j < reviewsPerUser; j++) {
      const id = faker.random.uuid();

      const reviewInfo = {
        handle: userId,
        review_id: id,
        place_id: place_id,
        review: faker.lorem.sentence(),
        upvote_count: faker.random.number({
          min: 1,
          max: 50
        }),
        created_at: faker.date.between("2016-01-01", "2017-01-27")
      };

      rdata.push(reviewInfo);
    }
  }
}

const ufile = "Users.json";
const rfile = "Reviews.json";
const pfile = "Places.json";

jsonfile.writeFileSync(ufile, udata, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("data created successfully");
  }
});

jsonfile.writeFileSync(rfile, rdata, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("data created successfully");
  }
});

jsonfile.writeFileSync(pfile, pdata, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("data created successfully");
  }
});
