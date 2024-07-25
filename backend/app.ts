const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const { rateLimit } = require('express-rate-limit');


const indexRouter = require('./routes/index.ts');
const port = process.env.PORT || 3000;

const app = express();



var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static(path.join(__dirname, "public/dist")));
app.set("trust proxy", true)

app.use("/", indexRouter);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-7", 
  legacyHeaders: false,
});

app.use(limiter);

app.get("*", (req:any, res:any) => {
  res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

app.listen(port, () => {
  console.log(`EVC Viewer is running on ${port}`);
});

module.exports = app;
