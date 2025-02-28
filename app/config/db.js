const Neode  = require('neode');
const get_instance = () => {
   const instance = Neode.fromEnv();
   return instance;
}
module.exports = {
   get_instance
}