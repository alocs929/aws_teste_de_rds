var mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
  // host     : 'database-2.cxvae5qbad5d.us-east-1.rds.amazonaws.com',
  // user     : 'ubuntu',
  // password : '',
  // port     : 3306
});

module.exports = connection;