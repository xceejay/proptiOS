function connection() {
  try {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
      host: process.env.PMAPI_MYSQL_HOST,
      user: process.env.PMAPI_MYSQL_USER,
      password: process.env.PMAPI_MYSQL_PASS,
      database: process.env.PMAPI_MYSQL_DB,
      connectionLimit: 5, // Adjust based on your needs
      metaAsArray: true,
      bigIntAsNumber: true,
      allowPublicKeyRetrieval: true, // Add this option
      ssl: {
        rejectUnauthorized: false // Only needed if using SSL, otherwise omit this
      }
    });

    return pool;
  } catch (error) {
    console.log(error);
  }
}

const pool = connection();

module.exports = pool;