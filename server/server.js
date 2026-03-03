const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorCheck = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    // origin: [process.env.FRONTEND_URL],
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true
}))

app.get("/", (req, res) => {
    res.status(200).json({
        service: "Personal Book Manager",
        status: "ACTIVE",
        time: new Date(),
    })
})

app.use("/", require("./routes/userRoutes"));
// app.use("/api/quiz", require("./routes/quizRoutes"));

//Handling Error Midddleware
app.use(errorCheck);

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running successfully on http://localhost:${process.env.PORT}`))
        .catch(error => console.log(error))
})
