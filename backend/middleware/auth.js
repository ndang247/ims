const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

function authenticateJWT(req, res, next) {
  const token = req.body.token || req.header('Authorization') || req.header("x-access-token");
  
  if (!token) return res.status(401).send({
    "error": "Unauthorized",
  });

  console.log('JWT KW: ', process.env.JWT_KEY)

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/**
 * roles: array of roles that are allowed to access the endpoint
 */
function enableRoleAccess(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user)) return res.status(403).send({
      "error": "Forbidden",
    });
    next();
  };
}

module.exports = {
  authenticateJWT,
  enableRoleAccess
}