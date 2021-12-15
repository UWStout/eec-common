import MongoDB from 'mongodb'
import assert from 'assert'
import ArrayToCsv from 'arrays-to-csv'

const MongoClient = MongoDB.MongoClient

const agg = [{
  $match: {}
}, {
  $lookup: {
    from: 'Users',
    localField: 'userID',
    foreignField: '_id',
    as: 'user'
  }
}, {
  $addFields: {
    teamID: {
      $first: '$user.teams'
    }
  }
}, {
  $addFields: {
    date: {
      $dateToString: {
        date: '$timestamp',
        format: '%m/%d/%Y %H:%M',
        timezone: 'America/Chicago'
      }
    }
  }
}, {
  $lookup: {
    from: 'Affects',
    localField: 'affectID',
    foreignField: '_id',
    as: 'affect'
  }
}, {
  $lookup: {
    from: 'Teams',
    localField: 'teamID',
    foreignField: '_id',
    as: 'team'
  }
}, {
  $addFields: {
    teams: {
      $reduce: {
        input: '$team.name',
        initialValue: '',
        in: {
          $cond: [{
            $eq: [
              '$$value',
              ''
            ]
          }, {
            $concat: [
              '$$this'
            ]
          }, {
            $concat: [
              '$$value',
              ', ',
              '$$this'
            ]
          }]
        }
      }
    }
  }
}, {
  $project: {
    _id: 0,
    date: 1,
    isPrivate: 1,
    affect: {
      $first: '$affect'
    },
    userName: {
      $first: '$user.name'
    },
    preferredName: {
      $first: '$user.preferredName'
    },
    teams: 1
  }
}, {
  $project: {
    date: 1,
    isPrivate: 1,
    affectName: '$affect.name',
    affectEmoji: {
      $first: '$affect.characterCodes'
    },
    userName: 1,
    preferredName: 1,
    teams: 1
  }
}, {
  $sort: {
    timestamp: 1
  }
}]

MongoClient.connect(
  'mongodb+srv://berriers:a0Pz9gGUbOwgTfyM@karunacluster1.yb2nw.mongodb.net/test?authSource=admin&replicaSet=atlas-18vq4h-shard-0&readPreference=primary&appname=MongoDB+Compass&ssl=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function (connectErr, client) {
    assert.equal(null, connectErr)
    const coll = client.db('karunaData').collection('AffectHistory')
    coll.aggregate(agg).toArray((err, results) => {
      if (err) {
        console.error(err)
      } else {
        const csvGenerator = new ArrayToCsv(results, { delimiter: ',', quote: '"' })
        csvGenerator.saveFile('./data.csv')
      }
      client.close()
    })
  }
)
