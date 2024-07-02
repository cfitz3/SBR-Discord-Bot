const mysql = require('mysql');
const config = require('../../../config.json')

class Database {
  constructor() {
    if (!Database.instance) {
      this.connect();
      Database.instance = this;
    }
    return Database.instance;
  }

  connect() {
    this.connection = mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database
      
    });
    this.connection.connect(err => {
      if (err) {
        console.error('Error connecting to the database:', err);
        setTimeout(() => this.connect(), 5000); // Attempt to reconnect every 5 seconds
        return;
      }
      console.log('Successfully connected to the database.');
    });

    // Handle connection errors and attempt reconnection
    this.connection.on('error', err => {
      console.error('Database error:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this.connect(); // Reconnect if the connection is lost
      } else {
        throw err;
      }
    });
  }

  getConnection() {
    return this.connection;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;