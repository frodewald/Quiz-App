require('dotenv').config();

module.exports = {
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@wald-cluster-shard-00-00.wwy2c.mongodb.net:27017,wald-cluster-shard-00-01.wwy2c.mongodb.net:27017,wald-cluster-shard-00-02.wwy2c.mongodb.net:27017/${process.env.DB_NAME}?replicaSet=atlas-944cly-shard-0&ssl=true&authSource=admin`
}
