import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const generateTokens = async (admin) => {
  const accessTokenPayload = { id: admin.id, role: admin.role };
  const refreshTokenPayload = { id: admin.id };

  const accessToken = generateAccessToken(accessTokenPayload);
  const refreshToken = generateRefreshToken(refreshTokenPayload);

  // Store refresh token in database
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await refreshToken.create({
    data: {
      token: refreshToken,
      adminId: admin.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};
