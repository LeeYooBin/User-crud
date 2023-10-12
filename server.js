const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/userRoute');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});