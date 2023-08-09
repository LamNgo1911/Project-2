const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  // console.log(token);
  // res.cookie(name,value,{options})
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000 * 3600 * 24),
  //   secure: process.env.NODE_ENV === "production",
  //   signed: true,
  // });
  console.log(token)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      name: user.name,
      id: user._id,
      role: user.role,
      email: user.email,
    },
  });
};

module.exports = sendTokenResponse;
