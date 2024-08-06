require("dotenv").config();
require("express-async-errors");
const express = require("express");

const app = express();

const notFoundMiddleware = require("./middleware/not-Found");


app.use(express.json());

app.use(notFoundMiddleware);


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
