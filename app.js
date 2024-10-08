require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const notFoundMiddleware = require("./middleware/not-Found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const dbConnect = require("./config/dbConnect");

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoutes');
const vendorRoute = require('./routes/vendorRoutes')
const dispatcherRoute = require('./routes/dispatcherRoutes')

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/vendor", vendorRoute)
app.use("/api/v1/dispatch", dispatcherRoute)

app.use(notFoundMiddleware);


app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port} `);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
