require('dotenv').config();

module.exports = {
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@wald-cluster-shard-00-00.wwy2c.mongodb.net:${process.env.DB_PORT},wald-cluster-shard-00-01.wwy2c.mongodb.net:${process.env.DB_PORT},wald-cluster-shard-00-02.wwy2c.mongodb.net:${process.env.DB_PORT}/${process.env.DB_NAME}?replicaSet=atlas-944cly-shard-0&ssl=true&authSource=admin`
}
