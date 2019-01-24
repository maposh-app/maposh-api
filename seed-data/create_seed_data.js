const faker = require('faker');
const jsonfile = require('jsonfile');

const numUsers = 10;
const reviewsPerUser = 5;

const udata = [];
const rdata = [];
const handleNames = [];

faker.seed(1000);

for (let i = 0; i < numUsers; i++) {
  const handle = faker.internet.userName();
  handleNames.push(handle);
}

for (let i = 0; i < handleNames.length; i++) {
  const favourites = [];

  //create user info
  for (let k = 0; k < reviewsPerUser; k++) {
    favourites.push(faker.company.companyName());
  }

  const name = faker.name.findName();
  const location = faker.address.city();
  const description = faker.name.jobTitle();

  const userInfo = {
    handle: handleNames[i],
    name: name,
    location: location,
    description: description,
    favourites: favourites,
  };

  udata.push(userInfo);

  for (let j = 0; j < reviewsPerUser; j++) {
    const id = faker.random.uuid();

    const reviewInfo = {
      handle: handleNames[i],
      review_id: id,
      review: faker.lorem.sentence(),
      upvote_count: faker.random.number({
        min: 1,
        max: 50,
      }),
      created_at: faker.date.between('2016-01-01', '2017-01-27'),
    };

    rdata.push(reviewInfo);
  }
}

const ufile = 'Users.json';
const rfile = 'Reviews.json';

jsonfile.writeFileSync(ufile, udata, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});

jsonfile.writeFileSync(rfile, rdata, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});
