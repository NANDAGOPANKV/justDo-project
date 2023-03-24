const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const noCache = require("nocache");

// local modules
// controllers
const { saveUser, promiseGetData } = require("./controller/userController");
// db
const db = require("./db/connection");
const session = require("express-session");

// routes
const userRouter = require("./routes/userRoutes/userRouter");
const adminRouter = require("./routes/adminRoutes/adminRouter");

// app
const app = express();

// port
const port = 3000;

// port listen to run backend
app.listen(port, console.log(`Server Started On ${port}`));

// db connection
app.set(db);
// view engine set
app.set("view engine", "hbs");
app.set("views", "./views");

// cashe
app.use(noCache());
// body parser to encode data form req
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// print url with method type
app.use((req, res, next) => {
  console.log(req.method + req.originalUrl);
  next();
});

app.use(cookieParser());
app.use(
  session({
    secret: "imgopan",
    saveUninitialized: true,
    cookie: { maxAge: 2e5 },
    resave: false,
  })
);

// admin and user routs
app.use("/", userRouter);
app.use("/admin", adminRouter);
