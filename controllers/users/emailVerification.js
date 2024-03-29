const { User } = require("../../models");
const { NotFound } = require("http-errors");

const emailVerification = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken: verificationToken });
  if (!user) {
    throw NotFound();
  }
  await User.findByIdAndUpdate(user._id, {
    verification: true,
    verificationToken: null,
  });
  res.status(200).json({
    data: "Email verification is successful",
  });
};

module.exports = emailVerification;
