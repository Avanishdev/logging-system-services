require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.route');
const logRoutes = require('./routes/log.route');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})

module.exports = app;
