const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

const secret = "X975hEci2MfB1XJW5Ewngx1IBS9NpllWx5LO"

const createUser = async (req, res) => {
  try {
    const user = req.body;
    const result = bodyChecker(user, res);

    if (result) return result;

    // Verifica se o username está em uso
    const existingUser = await userService.findUserByUsername(user.username);
    if (existingUser) return res.status(409).send({ message: "O username já está em uso." });

    // Verifica se o email está em uso
    const existingEmail = await userService.findUserByEmail(user.email);
    if (existingEmail) return res.status(409).send({ message: "O email já está em uso." });

    const newUser = await userService.createUser(user);

    return res.status(201).send(await userService.createUser(newUser));
  } 
  catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Erro ao criar o usuário." });
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAll();
    return res.status(200).send(users);
  } 
  catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Erro ao recuperar os usuários." });
  }
};

const findUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await userService.findUser(id);

    if (user) return res.status(200).send(user);
    else return res.status(404).send({ message: "Usuário não encontrado." });
  } 
  catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Erro ao recuperar o usuário." });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = req.body;
    const result = bodyChecker(user, res);

    if (result) return result;

    // Verifica se o username está em uso exceto pelo próprio usuário
    const existingUsername = await userService.findAnotherUserByUsername(user.username, id);
    if (existingUsername) return res.status(409).send({ message: "O username já está em uso." });

    // Verifica se o email está em uso exceto pelo próprio usuário
    const existingEmail = await userService.findAnotherUserByEmail(user.email, id);
    if (existingEmail) return res.status(409).send({ message: "O email já está em uso." });
    
    // Atualiza o usuário no banco de dados
    const updatedUser = await userService.updateUser(id, user);

    return res.status(200).send(updatedUser);
  } 
  catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Erro ao atualizar o usuário." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await userService.deleteUser(id);
    return res.status(204).send({ message: "Usuário excluido." });
  } 
  catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Erro ao excluir o usuário." });
  }
};

const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginService(email);

    if (!user || password !== user.password) return res.status(400).send({ message: "Usuário ou senha inválida" });

    const token = userService.generateToken(user._id, secret);
    res.status(200).send({
      user,
      token
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Não foi possível realizar o login" });
  }
};

const testingToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ message: "O token não foi informado" });

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return res.status().send({ message: "Token inválido" });

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema)) return res.status.send({ message: "Token malformatado" });

  jwt.verify(token, secret, (e, decoded) => {
    if (e) {
      console.log(e);
      return res.status(500).send({ message: "Erro interno" });
    }
    res.status(200).send(decoded);
  });
};

const bodyChecker = (body, res) => {
  // Verifica se há conteúdo no corpo da requisição
  if (Object.keys(body).length === 0) {
    return res.status(400).send({ message: "O corpo da mensagem está vazio." });
  };

  // Verifica se o campo 'username' está presente no corpo da requisição
  if (!body.username) {
    return res.status(400).send({ message: "O campo 'username' não foi encontrado." });
  };

  // Verifica se o campo 'email' está presente no corpo da requisição
  if (!body.email) {
    return res.status(400).send({ message: "O campo 'email' não foi encontrado." });
  };

  // Verifica se o campo 'password' está presente no corpo da requisição
  if (!body.password) {
    return res.status(400).send({ message: "O campo 'password' não foi encontrado." });
  };

  // Verificação simples para um formato de email que inclui @ e .com
  if (!isValidEmail(body.email)) {
    return res.status(400).send({ message: "O email não possui um formato válido." });
  }

  // Verifica se a senha possui pelo menos 8 caracteres
  if (body.password.length < 8) {
    return res.status(400).send({ message: "A senha deve possuir pelo menos 8 caracteres." });
  }

  return false;
};

const isValidEmail = email => email.includes("@") && email.includes(".com");

module.exports = {
  findAll,
  findUser,
  createUser,
  updateUser,
  deleteUser,
  loginService,
  testingToken
}