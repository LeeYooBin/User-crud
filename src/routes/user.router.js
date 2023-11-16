const express = require('express');
const usersController = require('../controllers/user.controller');

const router = express.Router();

router.post("/user", usersController.createUser);
router.get("/users", usersController.findAll);
router.get("/user/:id", usersController.findUser);
router.put("/user/:id", usersController.updateUser);
router.delete("/user/:id", usersController.deleteUser);
router.post("/login", usersController.loginService);
router.get("/test-token", usersController.testingToken);

module.exports = router;