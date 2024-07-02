const Database = require('../api/constants/sql.js'); 

/**
 * Increments the credit for a given user.
 * @param {string} userId - The ID of the user.
 * @param {number} incrementBy - The amount to increment the user's credits by.
 */
function incrementUserCredit(interaction, incrementBy) {
  return new Promise((resolve, reject) => {
    const userId = interaction.user.id;
    const connection = Database.getConnection();

    if (incrementBy === undefined) {
      console.error('incrementBy value is not defined.');
      reject('incrementBy value is not defined.');
      return;
    }

    const checkAwardedQuery = 'SELECT last_awarded FROM user_credits WHERE user_id = ? AND last_awarded > NOW() - INTERVAL 12 HOUR';

    connection.query(checkAwardedQuery, [userId], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0) {
        console.log(`User with ID ${userId} has already been awarded credits within the last 12 hours.`);
        resolve(false); // User has been awarded recently
        return;
      }

      const updateQuery = 'UPDATE user_credits SET credits = credits + ?, last_awarded = NOW() WHERE user_id = ?';

      connection.query(updateQuery, [incrementBy, userId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        if (result.affectedRows === 0) {
          const insertQuery = 'INSERT INTO user_credits (user_id, credits, last_awarded) VALUES (?, ?, NOW())';

          connection.query(insertQuery, [userId, incrementBy], (err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log(`New user added with ID ${userId} and initial credits of ${incrementBy}.`);
            resolve(true); // New user added
          });
        } else {
          console.log(`User with ID ${userId} had their credits incremented by ${incrementBy}.`);
          resolve(true); // Credits incremented
        }
      });
    });
  });
}

// In contracts/credits.js
function getUserCredits(interaction) {
  return new Promise((resolve, reject) => {
    const userId = interaction.user.id;
    const connection = Database.getConnection(); // Get the database connection
    const selectQuery = 'SELECT credits FROM user_credits WHERE user_id = ?';

    connection.query(selectQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user credits:', err);
        reject(err);
      } else if (results.length > 0) {
        resolve(results[0].credits); // Resolve with the credits value
      } else {
        resolve(0); // Resolve with 0 if user not found
      }
    });
  });
}

module.exports = { incrementUserCredit, getUserCredits };