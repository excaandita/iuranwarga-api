require('dotenv').config()

const PORT = process.env.PORT || 4000
const express       = require('express');

const usersRoutes   = require('./routes/users');
const middlewareLog = require('./middleware/logs');

const app = express();

app.use(middlewareLog);
app.use(express.json());

// app.method(path, handler);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});