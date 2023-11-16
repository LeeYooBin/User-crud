const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: value => value.includes("@") && value.includes(".com"),
      message: props => `${props.value} não é um formato de email válido!`
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;