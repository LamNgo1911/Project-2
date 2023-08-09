const sendTokenResponse = (user, statusCode, res) => {
  user.getSignedJwtToken();
  // console.log(token);
  // res.cookie(name,value,{options})
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000 * 3600 * 24),
  //   secure: process.env.NODE_ENV === "production",
  //   signed: true,
  // });

  res.status(statusCode).json({
    success: true,
    user: {
      name: user.name,
      id: user._id,
      role: user.role,
      email: user.email,
    },
  });
};

module.exports = sendTokenResponse;
