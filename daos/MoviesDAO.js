//For modifying movies collection use.
class MoviesDAO {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
    }
    /**
     * 
     * @returns {Number} collection documents count
     */
    docCount() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        return collec.countDocuments();
    }
    /**
     * 
     * @returns {document} First old movie. 
     */
    findOld() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        return collec.findOne({lastModified: { $lt: new Date(new Date().setDate(new Date().getDate()-1))}});
    }
    /**
     * 
     * Delete documents with lastModified field older than 1 day. (Practically all docs that were not updated.)
     */
    deleteOld() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        const query = {
            lastModified : { $lt: new Date(new Date().setDate(new Date().getDate()-1))}
        }
        return collec.deleteMany(query);
    }
    deleteAll() {
        const collec = this.mongoClient.db('showtime').collection('movs');
        return collec.deleteMany({});   
    }
    update(docs) {
        const collec = this.mongoClient.db('showtime').collection('movs');
        const promise = [];
        docs.forEach((doc) => {
            promise.push(
                collec.updateOne(
                    {"filmID" : doc.filmID}, 
                    { 
                        $setOnInsert: {
                            title: doc.title,
                            filmID : doc.filmID,
                            overview: doc.overview,
                            length: doc.length,
                            teaser_uri: doc.teaser_uri,
                            classing: doc.classing,
                        },
                        $currentDate: { "lastModified" : true },
                    }, 
                    { upsert: true }
                )
            );
        });
        return Promise.all(promise);
    }
    insertMany(docs) {
        const collec = this.mongoClient.db('showtime').collection('movs');
        return collec.insertMany(docs);
    }
    insertOne(doc) {
        const collec = this.mongoClient.db('showtime').collection('movs');
        return collec.insertOne(doc);
    }
}

module.exports = MoviesDAO;