const {
  createUser,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  freezeUser,
  unFreezeUser,
  refreshToken,
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate a new refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ user: user.email }, process.env.REFRESH_JWT_KEY, {
    expiresIn: "2h", // Set the expiration time for the refresh token
  });
};

//Create User API
module.exports = {
  //!New User Create API
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  // Login API
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal server error",
        });
      }
      // Validation
      if (!results) {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password",
        });
      }

      const result = compareSync(body.password, results.password);
      if (result) {
        // Remove sensitive information from the user object
        results.password = undefined;

        // Generate access token
        const accessToken = jwt.sign({ user: results }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });

        // Generate refresh token
        const refreshToken = generateRefreshToken(results);

        // Return the tokens in the response
        return res.status(200).json({
          success: 1,
          message: "Login successful",
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: results.id,
            name: results.name,
            email: results.email,
          },
        });
      } else {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    });
  },

  //!Refresh Token
  refreshToken: (req, res) => {
    try {
      const { results } = req;
      const token = jwt.sign({ user: results }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).send(token);
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  // API To Get User by Id
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // API To Get All User
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // API To Update User
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    });
  },
  // API To Delete User
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
      });
    });
  },
  freezeUser: (req, res) => {
    const data = req.body;
    freezeUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "User Freeze Successfully",
      });
    });
  },
  unFreezeUser: (req, res) => {
    const data = req.body;
    unFreezeUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "User UnFreeze Successfully",
      });
    });
  },
};
