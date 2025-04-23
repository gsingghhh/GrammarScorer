import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connectDB.js";
import userRoutes from "./routes/user.routes.js";
import transcriptionRoutes from "./routes/file.routes.js";
import profileRoutes from "./routes/profile.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI).then(() => console.log('Connected to DB'))
.catch((err) => {
  console.log('Connection unsuccessful', err.message)
})

app.get("/", (req, res) => {
  return res.send("Grammar Scorer Engine");
});

app.use("/api/user", userRoutes);
app.use("/api/transcription", transcriptionRoutes)
app.use('/api/profile', profileRoutes)

app.listen(PORT, () => {
  console.log(`App listening to PORT: ${PORT}`);
});
