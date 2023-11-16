const mongoose = require("mongoose");

const connection = () => {
  mongoose.connect(`mongodb://127.0.0.1:27017/db-1`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
    .catch(e => console.log(`DB connection error: ${e}`));
}

module.exports = connection;