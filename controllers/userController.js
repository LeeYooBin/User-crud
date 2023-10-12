const users = [
  {
    ID: 1,
    username: "user1",
    email: "user1@email.com",
    password: "user1234"
  },
  {
    ID: 2,
    username: "user2",
    email: "user2@email.com",
    password: "user4321"
  }
];

let nextID = 3;

const createUser = (req, res) => {
  const body = req.body;

  const result = bodyChecker(body, res);

  if (result) return result;

  // Verifica se o username está em uso
  if (users.some(user => user.username === body.username)) {
    return res.status(409).send({ message: "O username já está em uso." });
  }

  // Verifica se o email está em uso
  if (users.some(user => user.email === body.email)) {
    return res.status(409).send({ message: "O email já está em uso." });
  }

  // Verifica se o password está em uso
  if (users.some(user => user.password === body.password)) {
    return res.status(409).send({ message: "O password já está em uso." });
  }

  const user = {
    ID: nextID,
    ...body
  }
  nextID += 1;

  users.push(user);
  res.status(201).send(users);
}

const findAll = (req, res) => {
  res.status(200).send(users);
}

const findUser = (req, res) => {
  const id = req.params.id;
  const user = users.find(user => user.ID === parseInt(id));

  if (user) res.status(200).send(user);
  else res.status(404).send({ message: "Usuário não encontrado." });
}

const updateUser = (req, res) => {
  const id = req.params.id;
  const body = req.body;

  // Verifica se o usuário foi encontrado
  const user = users.find(user => user.ID === parseInt(id));
  if (!user) return res.status(404).send({ message: "Usuário não encontrado." });

  const result = bodyChecker(body, res);

  if (result) return result;

  // Verifica se o username está em uso exceto pelo próprio usuário
  if (users.some(user => user.ID !== parseInt(id) && user.username === body.username)) {
    return res.status(409).send({ message: "O username já está em uso." });
  }

  // Verifica se o email está em uso exceto pelo próprio usuário
  if (users.some(user => user.ID !== parseInt(id) && user.email === body.email)) {
    return res.status(409).send({ message: "O email já está em uso." });
  }

  // Verifica se o password está em uso exceto pelo próprio usuário
  if (users.some(user => user.ID !== parseInt(id) && user.password === body.password)) {
    return res.status(409).send({ message: "O password já está em uso." });
  }

  user.username = body.username;
  user.email = body.email;
  user.password = body.password;

  res.status(200).send(user);
}

const deleteUser = (req, res) => {
  const id = req.params.id;

  // Encontra o índice do usuário a ser excluído
  const userIndex = users.findIndex(user => user.ID === parseInt(id));

  if (userIndex === -1) return res.status(404).send({ message: "Usuário não encontrado." });
  
  users.splice(userIndex, 1);

  res.status(204).send();
}

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
}

const isValidEmail = email => email.includes("@") && email.includes(".com");

module.exports = {
  findAll,
  findUser,
  createUser,
  updateUser,
  deleteUser
}