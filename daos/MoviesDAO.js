//For modifying movies collection use.
class MoviesDAO {
    constructor({mongoClient}) {
        this.mongoClient = mongoClient;
    }
    docCount() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        try{
            return collec.countDocuments();
        }catch(e) {
            console.error(e);
        }
    }
    async deleteAll() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        try{
            await collec.deleteMany({});
        }catch(e) {
            console.error(e);
        }
            
    }
    async insertMany(docs) {
        const collec = this.mongoClient.db('showtime').collection('movs');
        try{
            await collec.insertMany(docs);
        }catch(e) {
            console.error(e);
        }
    }
}

module.exports = MoviesDAO;