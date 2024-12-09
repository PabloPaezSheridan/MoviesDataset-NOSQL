u9//1
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