require("dotenv").config();
const jwt=require("jsonwebtoken");
const repository=require("../repositories/applications.repository");
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
    const accessToken = jwt.sign(
        {
            userId: payload.userId
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
