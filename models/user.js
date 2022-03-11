import mongoose from "mongoose";
const { Schema } = mongoose;
const UserSchema = new Schema({

    userId: {
        type: String,
        trim: true,
        required: [true, 'userId is mandatory']
    },
    userName: {
        type: String,
        trim: true,
        required: [true, 'Name is mandatory']
    },
    role: {
        type: String,
        enum: ['ADM', 'REG'],
        required: [true, 'role is mandatory']
    },
    email: {
        type: String,
        trim: true,
        // required: [true, 'email is mandatory']
    },
    achivements: Array,
    Notifications: Array

});
export default mongoose.model("User", UserSchema);