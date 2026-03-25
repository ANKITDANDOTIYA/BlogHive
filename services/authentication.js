const JWT = require('jsonwebtoken');

const secret = "@assoonasp#123";

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        role: user.role,
    };

    const token = JWT.sign(payload, secret, { expiresIn: "1d" });
    return token;

}

function verifyToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    verifyToken,
};