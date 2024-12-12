//1
db.movies.find();

//2
db.movies.countDocuments()

//3
db.movies.insertOne({"cast": "emma watson", "genres": "fantasy", "title": "Harry Poter"})

//4
db.movies.deleteOne({"title": "Harry Potter 1"})

//5
db.movies.find({"cast": {$regex: / and /}}).count()

//6
db.movies.updateMany({"cast": {$regex: / and /}},{$pull:{"cast":" and "}})

//7
db.movies.find({"cast": []}).count()

//8
db.movies.updateMany({"cast": []},{$set: {"cast": [undefined]}})

//9
db.movies.find({"genres": []}).count()

//10
db.movies.updateMany({"genres":[]},{$set:{"genres": [undefined]}})

//11
db.movies.aggregate({$match: {year: {$exists: true}}},{$sort: {year:-1}}, {$limit: 1})

//12
db.movies.aggregate([
        {
            $match: {
                year:{$gte: 1998}
            }
        },
        {
            $count: "last20yearsNumberOfFilms"
        }
    ])
    
//13
db.movies.aggregate([
        {
            $match: {
                $and : [{year :{$gte: 1960}},{year: {$lte:1969}}]
            }
        },
        {
            $count: "last20yearsNumberOfFilms"
        }
    ])
    
//14

db.movies.aggregate([
    {
        $group: {
            _id: "$year",
            moviesNumber: { $sum: 1 }
        }
    },
    {
        $sort: {"moviesNumber":-1}
    },
      {
        $group: {
            _id :null,
           maxNumberMovies: { $first: "$moviesNumber" }
        }
    },
    {
        $project: {
            maxNumberMovies: 1
        }
    },
     {
        $lookup: {
            from: "movies",
            let: {maxNumberMovies: "$maxNumberMovies" },
            pipeline: [
                {
                    $group: {
                        _id: "$year",
                        moviesNumber: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ['$moviesNumber',  "$$maxNumberMovies" ] },
                    }
                },
                {
                    $project: {
                        moviesNumber : false
                    }
                }
            ],
            as: "years"
        }
     }
])
 