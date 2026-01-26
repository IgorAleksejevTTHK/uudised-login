const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "igor"
});

db.connect(err => {
    if (err) {
        console.error("SQL error:", err.message);
    } else {
        console.log("SQL connected");
    }
});

module.exports = db;
