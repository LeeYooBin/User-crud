const express = require('express');
const usersController = require('../controllers/userController');

const router = express.Router();

router.post("/user", usersController.createUser);
router.get("/users", usersController.findAll);
router.get("/user/:id", usersController.findUser);
router.put("/user/:id", usersController.updateUser);
router.delete("/user/:id", usersController.deleteUser);

module.exports = router;