const pool = require("../../config/database");

let currentTimeStamp = new Date().toISOString().slice(0, 19).replace("T", " ");
module.exports = {
  //! Create New User
  createUser: (data, callBack) => {
    // Check if the email already exists
    pool.query(
      `SELECT COUNT(*) AS count FROM users_logins WHERE email = ?`,
      [data.email],
      (emailCheckError, emailCheckResults) => {
        if (emailCheckError) {
          console.error("Email check error:", emailCheckError);
          callBack(emailCheckError);
        } else {
          // Check the count of rows with the given email
          const emailCount = emailCheckResults[0].count;
          if (emailCount > 0) {
            // Email already exists, return an error
            callBack({
              success: 0,
              message: "Email already exists. Please use a different email..",
            });
            return false;
          } else {
            pool.query(
              `insert into users_details(first_name, last_name, gender, dob, email, mobile, address, added_on, status) 
              values(?,?,?,?,?,?,?,?,?)`,
              [
                data.first_name,
                data.last_name,
                data.gender,
                data.dob,
                data.email,
                data.mobile,
                data.address,
                currentTimeStamp,
                1,
              ],
              (error, results, fields) => {
                if (error) {
                  console.error("User creation error:", error);
                  callBack(error);
                } else {
                  // Extract the ID of the inserted user
                  const userId = results.insertId;
                  // Email does not exist, proceed with user creation
                  pool.query(
                    `insert into users_logins(user_id,name, email, password, added_on, is_freeze, status) 
                values(?,?,?,?,?,?,?)`,
                    [
                      userId,
                      data.first_name +" "+ data.last_name,
                      data.email,
                      data.password,
                      currentTimeStamp,
                      1,
                      1,
                    ],
                    (errorSecondQuery, resultsSecondQuery, fieldsSecondQuery) => {
                      if (errorSecondQuery) {
                        console.error(
                          "Details insertion error:",
                          errorSecondQuery
                        );
                        callBack(errorSecondQuery);
                      } else {
                        callBack(null, resultsSecondQuery);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  },

  //! Getting user by email address
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from users_details as a LEFT JOIN users_logins as b ON a.id = b.user_id where a.email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  //! Getting user by user id
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select * from users_details as a LEFT JOIN users_logins as b ON a.id = b.user_id where a.id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  //! Getting All Users
  getUsers: (callBack) => {
    pool.query(`select * from users_details as a LEFT JOIN users_logins as b ON a.id = b.user_id`, [], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },

  //! Update User
  updateUser: (data, callBack) => {
    pool.query(
      `update users_logins set name=?, email=?, password=? where id = ?`,
      [data.name, data.email, data.password, data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  //! Freeze User
  freezeUser: (data, callBack) => {
    pool.query(
      `update users_logins set is_freeze=? where id = ?`,
      [0, data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  //! Unfreeze User
  unFreezeUser: (data, callBack) => {
    pool.query(
      `update users_logins set is_freeze=? where id = ?`,
      [1, data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  //! Delete User
  deleteUser: (data, callBack) => {
    pool.query(
      `update users_logins set status=? where id = ?`,
      [0, data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
