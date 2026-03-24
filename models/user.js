const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("node:crypto");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,

    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "/images/profile.png",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    }
});

 

userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");

    const hash = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.password = hash;
    user.salt = salt;
});


userSchema.static("matchPassword", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

     

    const salt = user.salt;
    const hash = createHmac("sha256", salt).update(password).digest("hex");


    return {...user._doc,password: undefined,salt: undefined};;

});

const User = model("User", userSchema);

module.exports = User;