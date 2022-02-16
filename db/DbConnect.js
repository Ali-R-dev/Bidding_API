import mongoose from "mongoose";

const DbConnect = async (dbUri) => {
    try {
        await mongoose.connect(dbUri);
        console.log("connected to db...");
    } catch (error) {
        console.log("could not connect to db");
        throw error;
    }
};
export default DbConnect;