const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createUser,
  login,
  getUserByUserId,
  getUsers,
  updateUsers,
  deleteUser,
  freezeUser,
  unFreezeUser,
  refreshToken,
} = require("./user.controller");

router.get("/getAllUsers", checkToken, getUsers);
router.post("/addNewUser", createUser);
router.get("/getUserByUserId/:id", checkToken, getUserByUserId);
router.post("/login", login);
router.get("/verifyToken", checkToken);
router.get("/refresh",refreshToken);
router.patch("/updateUser", checkToken, updateUsers);
router.delete("/deleteUser/:id", checkToken, deleteUser);
router.patch("/freezeUser/:id",checkToken, freezeUser);
router.patch("/unFreezeUser/:id",checkToken, unFreezeUser);

module.exports = router;
