// middleware/jwtMiddleware.js
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('private.pem', 'utf8');
const publicKey = fs.readFileSync('public.pem', 'utf8');

const signOptions = {
  algorithm: 'RS256', // RSA with SHA-256
  expiresIn: '1min', // Token expiration time
};

const verifyOptions = {
  algorithms: ['RS256'],
};

const signToken = (payload) => {
  return jwt.sign(payload, privateKey, signOptions);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, verifyOptions);
  } catch (err) {
    return null; // Token is invalid
  }
};

module.exports = { signToken, verifyToken };
