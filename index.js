const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const connection = require("./config");

const adminRouter = require("./routes/admins");
const userRouter = require("./routes/users");
const cookiePasrser = require("cookie-parser");

dotenv.config();
app.set("port", process.env.PORT || 5000);

app.use(morgan("dev"));
//x-www-form-urlencoded를 사용하면 필요
app.use(express.urlencoded({
  limit : "10mb",
  extended : true
}))
app.use(express.json({
  limit: "10mb"
}));
app.use(cookiePasrser());

app.use("/", userRouter);
app.use("/", adminRouter);

connection();

app.listen(app.get("port"), () => {
  console.log("Example app listening on port", app.get("port"));
});
