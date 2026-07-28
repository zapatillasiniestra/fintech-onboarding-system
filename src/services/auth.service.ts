import jwt from "jsonwebtoken";
import repository from "../repositories/auth.repository";
import {AppError} from "../utils/AppError";

async function refresh(refreshToken: string) {
    const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET!
    );

    if (typeof payload === "string") {
        throw new Error("Invalid token");
    }

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

    await repository.deleteRefreshToken(
        refreshToken
    );

    const user = await repository.findUserById(payload.userId);
    const newRefreshToken = jwt.sign(
        {
            userId: user.id
        },
        process.env.REFRESH_SECRET!,
        {
            expiresIn: "7d"
        }
    );

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await repository.saveRefreshToken(
        user.id,
        newRefreshToken,
        expiresAt
    );

    const accessToken = jwt.sign(
    {
        userId: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET!,
    {
        expiresIn: "15m"
    }
    );

    return {
        accessToken,
        refreshToken: newRefreshToken
    };

}

export default refresh;