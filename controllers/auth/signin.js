const { User } = require("../../models");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const signin = async (req, res) => {
  const { email:notUpdatedEmail, password } = req.body;
  const email = notUpdatedEmail.toLowerCase()
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Email not registered");
  }
  if (!user.comparePassword(password)) {
    throw new Unauthorized("Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    user: {
      name: user.name,
      email,
    },
    token,
  });
};
module.exports = signin;
