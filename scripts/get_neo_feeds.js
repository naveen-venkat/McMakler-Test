const request = require('request');
const url = require('url');
const mongoose = require('mongoose');
const debug = require('debug')('neo-feeds');

const uri = 'mongodb://localhost:27017/nasa-neo';
const options = {
  server: {poolSize: 5},
  user: 'nodejsUser',
  pass: 'd!45dg%4n',
  useMongoClient: true
};

mongoose.connect(uri, options);
const schema = new mongoose.Schema({
  name: 'string',
  reference_id: 'string',
  close_approach_date: 'date',
  speed_kph: 'string',
  is_hazardous: 'boolean'
});
const neoFeedModel = mongoose.model('neo_feeds', schema);

const noOfFeedYearsBack = 2;
const now = new Date();
const endDate = new Date(now.getFullYear() - 1, 11, 31);
debug(`End date: ${endDate}`);

const startDate = new Date(endDate.getFullYear() - noOfFeedYearsBack, 0, 1);
debug(`Start date: ${startDate}`);

let queryStartDate = new Date(startDate);
debug(`Query start date: ${queryStartDate}`);

console.log(`Retrieving ${noOfFeedYearsBack + 1} years NEO feed, please wait: #`);

function getFormattedDate(dateObj) {
  return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
}

let interval = setInterval(() => {
  const neoFeedURL = url.format({
    protocol: 'https',
    host: 'api.nasa.gov',
    pathname: '/neo/rest/v1/feed',
    query: {
      detailed: false,
      start_date: getFormattedDate(queryStartDate),
      api_key: 'N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD'
    }
  });

  debug(`Requested url: ${neoFeedURL}`);

  const options = {
    url: neoFeedURL,
    method: 'GET',
    json: true
  };
  request(options, (err, res, body) => {
    //debug("Response:", body);
    if (!err && body.near_earth_objects) {

      let neoFeedObjectArray = [];
      let keys = Object.keys(body.near_earth_objects);
      keys.forEach((element) => {
        const neoFeeds = body.near_earth_objects[element];
        neoFeeds.forEach((neoFeed) => {
          const closeApproachData = neoFeed.close_approach_data.pop();
          neoFeedObjectArray.push({
            name: neoFeed.name,
            reference_id: neoFeed.neo_reference_id,
            close_approach_date: closeApproachData.close_approach_date,
            speed_kph: closeApproachData.relative_velocity.kilometers_per_hour,
            is_hazardous: neoFeed.is_potentially_hazardous_asteroid
          });
        })
      });

      neoFeedModel
        .create(neoFeedObjectArray)
        .then((res) => {
          debug(`Record saved`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      debug(`No data received for date ${queryStartDate}`)
    }
  });
  queryStartDate.setDate(queryStartDate.getDate() + 7);

  if (queryStartDate >= endDate) {
    clearInterval(interval);
    console.log('Successfully retrieved...!');
  }
}, 3000);


