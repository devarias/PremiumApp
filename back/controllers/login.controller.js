function login(req, res) {
  res.send({ username: 'premium@example.com', password: 'password' });
}
module.exports = { login };
