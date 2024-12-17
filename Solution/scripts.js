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

//15

db.movies.aggregate([
    {
        $match:{
            year : {$ne:null}
        }
    },
    {
        $group: {
            _id: "$year",
            moviesNumber: { $sum: 1 }
        }
    },
    {
        $sort: {"moviesNumber":1}
    },
      {
        $group: {
            _id :null,
           minNumberMovies: { $first: "$moviesNumber" }
        }
    },
    {
        $project: {
            minNumberMovies: 1
        }
    },
     {
        $lookup: {
            from: "movies",
            let: {minNumberMovies: "$minNumberMovies" },
            pipeline: [
                {
                    $group: {
                        _id: "$year",
                        moviesNumber: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ['$moviesNumber',  "$$minNumberMovies" ] },
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

//16
db.movies.aggregate(
     { $unwind : "$cast" },
     {
        $project: {_id:0}
     },
     {
        $out: "actors"  
     }
    )

db.actors.countDocuments()
    
//17
db.actors.aggregate(
    { $match : {"cast": {$ne: null}}},
    { $unwind: "$cast"},
    { $group: { "_id": "$cast",
                "performingsNumber": {$sum: 1}
    }},
    {
        $sort: {"performingsNumber": -1}
    },
    {
        $limit: 5
     }
    )

    
//18
db.actors.aggregate(
     { $match :  {"cast": {$ne: null}}},
     {
         $group: { 
             _id: {"title": "$title", "year": "$year"},
             actorsNumber: {$sum : 1}
         }
     },
    {
        $sort: {"actorsNumber": -1}
    },
    {
        $limit: 5
     }
    )
    
//19
db.actors.aggregate(
    { $match :  
        {$and: [
                {"cast": {$ne: null}}, 
                {"cast": {$ne: "and"}}
            ]
            
        }
    },
    { 
        $group: { _id: "$cast",
                startCareer:{$min: "$year"},
                endCareer: {$max: "$year"}
                
        }
    },
    {
        $project: {
            _id: 0,
            actorName: "$_id"
            startCareer: "$startCareer",
            endCareer: "$endCareer",
            yearsOfWork:  {$subtract: ["$endCareer", "$startCareer"] }
        }
    },
    { $sort:{"yearsOfWork" : -1} },
    { $limit: 5 }
    }
    )
    
//20
db.movies.aggregate(
     { $unwind : "$genres" },
     {
        $project: {_id:0}
     },
     {
        $out: "genres"  
     }
    )

db.genres.countDocuments()

//21

db.genres.aggregate(
    {
    $group: { 
        _id: ["$genres", "$year"]
        moviesNumber : {$sum:1}
        }
    },
    {$sort:{"moviesNumber":-1 }},
    {$limit:5}
    )

//22



db.genres.aggregate
(
    {
        $match :  
        {$and: [
                {"cast": {$ne: null}}, 
                {"cast": {$ne: "and"}},
                {"genres": {$ne: null}}
            ]
            
        }
    }
    {
        $unwind: "$cast"
    }
    {
        $group: { 
            _id: "$cast",
            genres: {$addToSet: "$genres"}
        }
    }
    {
        $project: {
            genres: "$genres"
            genresCount: {$size: "$genres" }
        }
    }
    {$sort: {"genresCount": -1}}
    {$limit: 5}
)

// 23
db.genres.aggregate
(
    {
        $match :  {"genres": {$ne: null}}
       
    }
    {
        $group: { 
            _id: {title:"$title", year:"$year"},
            genres: {$addToSet: "$genres"}
        }
    }
     {
        $project: {
            genres: "$genres"
            genresCount: {$size: "$genres" }
        }
    }
    {$sort: {"genresCount": -1}}
    {$limit: 5}
    )
