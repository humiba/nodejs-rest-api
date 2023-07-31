// TODO: Middleware handle logging
const logging = (request, response, next) => {
  console.log(`${new Date().toString()} => ${request.originalUrl}`);
  next();
};

module.exports = { logging };
