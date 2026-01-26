const express = require("express");
const session = require("express-session");
const newsRouter = require("./routes/news");
const authRouter = require("./routes/auth");

const app = express();


app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: "metshein_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60, httpOnly: true }
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use("/", newsRouter);
app.use("/", authRouter);


app.set("view engine", "ejs");


app.listen(3000, () => console.log("Server http://localhost:3000/"));
