const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://user:kml1326JAISWAL@ds263848.mlab.com:63848/heroku_c0thnq7r",
  { useNewUrlParser: true },
  function(err, connection) {
    if (err) throw err;
    else console.log("connected to mongodb");
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join('dist')));

app.set("views", path.join(__dirname, "./server/views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "blog-post",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    },
    store: new MongoStore({
      url: "mongodb://localhost/blog-post-session"
    })
  })
);

if (process.env.NODE_ENV === "development") {
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config");
  var compiler = webpack(webpackConfig);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(require("webpack-hot-middleware")(compiler));
}

app.use(passport.initialize());
app.use(passport.session());
require("./server/modules/passport")(passport);
app.use(cors());

app.use("/api", require("./server/routes/api"));
app.use(require("./server/routes/index"));

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
