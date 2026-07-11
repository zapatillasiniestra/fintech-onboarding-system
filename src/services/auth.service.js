require("dotenv").config();
const jwt=require("jsonwebtoken");
const repository=require("../repositories/auth.repository");
const AppError=require("../utils/AppError");

async function refresh(refreshToken) {
    const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
    );

    const stored =
    await repository.findRefreshToken(
        refreshToken
    );

    if (!stored) {
        throw new AppError(
            "invalid refresh token",
            401
        );
    }
    const user = await repository.findUserById(payload.userId);
    const accessToken = jwt.sign(
    {
        userId: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "15m"
    }
    );
    
    return {
        accessToken
    };

}

module.exports = {
  refresh
};
