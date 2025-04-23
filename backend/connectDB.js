import mongoose from "mongoose";

const connectDB = async (URI) => {
  await mongoose.connect(URI);
};

export default connectDB