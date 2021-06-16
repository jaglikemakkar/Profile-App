const mysql = require('mysql');

// SETTING DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'StoryApp2',
    password: 'jaglike',
});

db.connect((err)=>{
    if(err) throw err;
    console.log("MYSQL Connected");
});

// CREATING DATABASE

function createDatabase(){
    db.query("CREATE DATABASE StoryApp2", (err, result)=>{
        if (err) throw err;
        console.log("Database Created");
    });
};
// createDatabase();

function createUserTable(){
    db.query("create TABLE users (id INT, name VARCHAR(255) NOT NULL, bio VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL);", (err, result) => {
        if (err) throw err;
        console.log("Created User Table");
    });
}
// createUserTable();

function createStoryTable(){
    db.query("create TABLE storys (id INT , PRIMARY KEY (id),uri VARCHAR(1000));" , (err, result) => {
        if (err) throw err;
        console.log("Created Stories Table");
    });
}
// createStoryTable();

function createPicsTable(){
    db.query("create TABLE pics (id INT , PRIMARY KEY (id),uri VARCHAR(1000));", (err, result) => {
        if (err) throw err;
        console.log("Created Pics Table");
    });
}
// createPicsTable();

function insertUser(){
    db.query("INSERT INTO users (id,name, bio, email) VALUES (1,'JAGLIKE MAKKAR', 'STUDENT', 'www.jaglike.com');", (err, result) => {
        if (err) throw err;
        console.log("User Inserted");
    });
};
// insertUser();

function insertStory(){
    db.query("INSERT INTO storys (id,uri) VALUES (1,'https://static.wikia.nocookie.net/villains/images/9/91/The_Bay_Harbour_Butcher.jpeg/revision/latest?cb=20180714133537');", (err, result) => {
        if (err) throw err;
        console.log("Story Inserted");
    });
};
// insertStory();

function insertPic(uri){
    db.query("INSERT INTO pics (id,uri) VALUES (1,'" + uri + "');", (err, result) => {
        if (err) throw err;
        console.log("pics inserted");
    });
};
// insertPic("https://www.mavenmentors.in/static/base/images/jaglike.PNG");


// QUERY HANDLING
async function getUser(){
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users;", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

async function getPic(){
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM pics;", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

async function deletePic(){
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM pics WHERE id=1", (err, results) => {
            if (err) return reject(err);
            resolve(results);
            console.log("Deleted Pic");
        });
    });
};

async function addPic(uri){
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO pics (id,uri) VALUES (1,'"+ uri +"');", (err, results) => {
            if (err) return reject(err);
            resolve(results);
            console.log("Added Pic");
        });
    });
};

async function mutatePic(uri){
    const a = await deletePic();
    const b = await addPic(uri);
};

module.exports = {
    getUser: getUser,
    getPic: getPic,
    mutatePic: mutatePic,
};