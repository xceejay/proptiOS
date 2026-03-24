const axios = require("axios");

const validateQuantity = (quantity) => {
  let regex = /^[1-9]\d*$/;
  return regex.test(trim(quantity));
};

const validateEmail = (email) => {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(trim(email)).toLowerCase());
};


function validateSQLDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function validateTimestamp(dateString) {
  const rfc3339Regex =
    /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?([Zz]|[+\-](\d{2}):(\d{2}))$/;
  if (!rfc3339Regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return dateString === date.toISOString().replace(".000", "");
}

const validateDomain = (domain) => {
  var regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  return regex.test(String(trim(domain)).toLowerCase());
};

const trim = (text) => {
  if (typeof text !== "undefined" && text !== null) {
    return text.trim();
  }
  return null;
};

const moneyFormat = (amount) => {
  let formattedAmount = parseFloat(Math.round(amount * 100) / 100).toFixed(2);
  return formattedAmount.replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

const moneyFormatWithoutComma = (amount) => {
  return parseFloat(Math.round(amount * 100) / 100).toFixed(2);
};

const tokenGenerator = (email) => {
  return sha256(email + Math.floor(Math.random() * 999999) + 999999);
};

const sendTelegramAlert = (url) => {
  // let response = false;
  axios
    .get(url, {
      auth: {
        username: process.env.HTTP_BASIC_AUTH_USER,
        password: process.env.HTTP_BASIC_AUTH_PASS,
      },
    })
    .then((data) => {
      // response = true;
    })
    .catch((err) => {
      console.log("Error from request");
      console.dir(err);
    });

  // return {
  //   status: response
  // }
};

module.exports = {
  validateSQLDate,
  validateTimestamp,
  validateQuantity,
  trim,
  validateEmail,
  moneyFormat,
  moneyFormatWithoutComma,
  tokenGenerator,
  sendTelegramAlert,
  validateDomain,
};
