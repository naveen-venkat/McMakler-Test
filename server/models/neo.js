'use strict';

const debug = require('debug');

module.exports = function (Neo) {

  Neo.hazardous = () => {
    return Neo.find({where: {is_hazardous: true}});
  };

  Neo.fastest = (hazardous) => {
    return Neo.find({where: {is_hazardous: hazardous === 'true'}, order: "speed_kph DESC", limit: 1});
  };

  Neo.bestByYear = (hazardous, cb) => {
    const collection = Neo.getDataSource().connector.collection(Neo.modelName);
    let pipeline = [];

    pipeline.push(
      {
        $match: {
          is_hazardous: hazardous === 'true'
        }
      },
      {
        $group: {
          _id: {$year: "$close_approach_date"},
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 1
      },
      {
        $project: {
          _id: 0,
          count: 1,
          close_approach_year: "$_id"

        },
      }
    );

    return collection.aggregate(pipeline, (err, res) => {
      cb(err, res);
    });
  };

  Neo.bestByMonth = (hazardous, cb) => {
    const collection = Neo.getDataSource().connector.collection(Neo.modelName);
    let pipeline = [];

    pipeline.push(
      {
        $match: {
          is_hazardous: hazardous === 'true'
        }
      },
      {
        $group: {
          _id: {$month: "$close_approach_date"},
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 1
      },
      {
        $project: {
          _id: 0,
          count: 1,
          close_approach_month: "$_id"
        },
      }
    );

    return collection.aggregate(pipeline, (err, res) => {
      cb(err, res);
    });
  };
};
