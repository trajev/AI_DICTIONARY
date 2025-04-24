const express = require('express');
const connectDB = require("./config/db.js");
const cors = require('cors');
const morgan = require('morgan');
require("dotenv").config();

const UserRoutes = require("./routes/User.routes.js");
const wordEntryRoutes = require("./routes/WordEntry.routes.js");
const authMiddleware = require("./middlewares/auth.middlewares.js");

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( morgan("dev") );

app.use( "/api/users", UserRoutes );
app.use( "/api/word", authMiddleware, wordEntryRoutes );

app.get('/', (req, res) => {
  res.send('Hello World!');
});


connectDB();


app.listen( process.env.PORT || 3000 , () => {
  console.log("Server is running on port 3000")
})

