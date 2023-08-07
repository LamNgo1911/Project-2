const sendTokenResponse = (user, statusCode, req, res) => {
  const token = user.getSignedJwtToken();

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 3600 * 24),
    signed: true,
  };

  // Set secure option based on HTTPS requirement
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    cookieOptions.secure = true; // Set secure cookie for HTTPS
  }

  // Set sameSite option based on cross-site considerations
  if (req.headers.origin) {
    const originHost = new URL(req.headers.origin).hostname;
    if (originHost !== req.hostname) {
      cookieOptions.sameSite = "none"; // Set sameSite to "none" for cross-site requests
    }
  }

  // Set the token cookie
  res.cookie("token", token, cookieOptions);

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
