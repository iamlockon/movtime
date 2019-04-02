class MongoService {
    /**
     * 
     * @param {MongoClient} mongoClient
     */
    constructor({mongoClient}) {
        this.mongoClient = mongoClient;
    }

    /**
     * 
     * @returns Promise<bool>
     */
    isConnected() {
        return Promise.resolve(this.mongoClient.isConnected())
    }
}
module.exports = MongoService;