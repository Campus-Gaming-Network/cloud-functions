const { customAlphabet } = require('nanoid');
const bcrypt = require('bcrypt');
const { NANO_ALPHABET, NANO_ID_LENGTH, SALT_ROUNDS } = require("./constants");

// Returns a callable function
const nanoid = customAlphabet(NANO_ALPHABET, NANO_ID_LENGTH);

const shallowEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  };
  
const changeLog = (prev, curr) => `${prev} -> ${curr}`;
  
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isAuthenticated = context => Boolean(context) && Boolean(context.auth) && Boolean(context.auth.uid);

const hashPassword = async (password) => await bcrypt.hash(password, SALT_ROUNDS);

const comparePasswords = async (password, hash) => await bcrypt.compare(password, hash);

module.exports = {
  shallowEqual,
  changeLog,
  isValidEmail,
  nanoid,
  isAuthenticated,
  hashPassword,
  comparePasswords,
};
