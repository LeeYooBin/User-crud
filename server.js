const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/routes/user.router');
const connection = require('./src/database/database');

const app = express();
connection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});