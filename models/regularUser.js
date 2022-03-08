import mongoose from "mongoose";
const { Schema } = mongoose;
const RegularUserSchema = new Schema({

    userId: {
        type: String,
        trim: true,
        required: [true, 'Name is mandatory']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email is mandatory']
    },
    achivements: Array,
    Notifications: Array

});
export default mongoose.model("RegularUser", RegularUserSchema);