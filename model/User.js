const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    phone:{
        type: number,
    }
})
const User = mongoose.model("User", UsersSchema);
module.exports = User;
