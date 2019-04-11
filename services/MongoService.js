module.exports = class MongoService {
    /**
     * 
     * @param {MongoClient} mongoClient
     */
    constructor({mongoClient, moviesDao}) {
        this.mongoClient = mongoClient;
        this.moviesDAO = moviesDao;
    }   

    /**
     * 
     * @returns Promise<bool>
     */
    isConnected() {
        return Promise.resolve(this.mongoClient.isConnected());
    }

    /**
     * @param {Number} lat
     * @param {Number} lng 
     * @returns {Promise<Object>} theaters
     */
    getNearbyTheaters(lat, lng, dist = 5) {
        return Promise.resolve(this.moviesDAO.getNearbyTheaters(lat, lng, dist));
    }
}