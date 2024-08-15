const dbPool = require('../../config/database')

const getAllUser = () => {
    const SQLQuery = 'SELECT * FROM users';

    return dbPool.execute(SQLQuery)
};

module.exports = {
    getAllUser
}