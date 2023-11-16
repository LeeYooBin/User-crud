const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createUser = (user) => {
  return User.create(user);
}

const findAll = () => {
  return User.find();
}

const findUser = (id) => {
  return User.findById(id);
}

const findUserByUsername = (username) => {
  return User.findOne({ username });
}

const findUserByEmail = (email) => {
  return User.findOne({ email });
}

const findAnotherUserByUsername = (username, id) => {
  return User.findOne({ username, _id: { $ne: id } });
}

const findAnotherUserByEmail = (email, id) => {
  return User.findOne({ email, _id: { $ne: id } });
}

const updateUser = (id, user) => {
  return User.findByIdAndUpdate(id, user, { returnDocument: "after" });
}

const deleteUser = (id) => {
  return User.findByIdAndDelete(id);
}

const loginService = async (email) => {
  return await User.findOne({ email });
};

const generateToken = (userId, secret) => {
  return jwt.sign({ userId }, secret, { expiresIn: 86400 });
};

module.exports = {
  createUser,
  findAll,
  findUser,
  findUserByUsername,
  findUserByEmail,
  findAnotherUserByUsername,
  findAnotherUserByEmail,
  updateUser,
  deleteUser,
  loginService,
  generateToken
}