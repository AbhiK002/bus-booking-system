import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

export function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    console.info("Verifying token");

    if(!token){
        console.error("Token absent for user");
        return res.status(401).json({ 
            message: "Unauthorized Access",
            relogin: true,
            valid: false
        })
    }

    if (token.startsWith("Bearer ")) token = token.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET_BBS, (err, decodedToken) => {
        if (err) {
            console.error("Unauthorized Access: " + err.message);
            return res.status(401).json({
                error: err.name,
                message: "Unauthorised Access",
                relogin: true,
                valid: false
            })
        }

        req.tokenUserId = decodedToken.userId;
        console.info("Token verified: User " + decodedToken.userId);
        next();
    })
}

export function generateToken(userId, callback) {
    return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET_BBS, { expiresIn: '36h'}, callback)
}