const cheerio = require('cheerio');
const axios = require('axios');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'movie-1546758871417.appspot.com';
//Works?
//process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/jay/movietime/gskey.json";

module.exports = {
    /**
     * 
     * @returns {Array<object>} res
     */
	getFilmID : function getFilmID() {
        return axios.get('http://www.atmovies.com.tw/movie/now/1/')
                    .then((res) => {
                        let $ = cheerio.load(res.data);
                        return $('#quickSelect select option').map((index, obj)=>{
                            if( index === 0 ) return;
                            return { 
                                filmID: $(obj).attr('value').split('/')[4],
                            }
                            }).get();
                    })
                    .catch((e) => console.error("Failed to get Film ID..:", e));
    },
    /**
     * 
     * @param {@google/storage.bucketName} buckName
     * @param {Array<{filmID: String }>} idArray
     * @returns {Array<String>} 
     */

    removeOld : async function removeOld(bucketName, idArray){
        /***
        Utility function to remove old files in the bucket.
        How to determine "old files"? => Those not exist in the filmID array.
        This function depends on @google/storage.
        ***/
        //To speed up, store filmID in a Map.
        const map = new Map();
        idArray.forEach(ele => map.set(ele.filmID, true));
        //Retrieve files in GCS
        const [files] = await storage.bucket(bucketName).getFiles();
        const promise = [];
        for (const file of files) {
            if (!map.has(file.name)) {
                promise.push(storage
                  .bucket(bucketName)
                  .file(file.name)
                  .delete()
                  .then(() => {
                      console.log(`gs://${bucketName}/${file.name} deleted.`);	
                  })
                  .then(() => file.name)
                  .catch((e) => console.error(`Delete ${file.name} from ${bucketName} failed,`, e)));
            } 
        }
        return Promise.all(promise);
    }
}

/*
Ok, now we get filmID in "result", let's compose the URL....
The poster URL looks something like 
"http://app2.atmovies.com.tw/poster/filmID/"
and the selector of the element is $('.shadow1 a'), the poster URL is
in "href" attribute. 
*/
function getPoster(result){

	for(let i = 0; i<result.length; i++){
		axios({
			method:'get',
			url:`http://app2.atmovies.com.tw/poster/${result[i].filmID}/`,
			})
			.then(async (res)=>{
				let $ = cheerio.load(res.data);
				let a = $('.shadow1 a');
				let imgurl = $(a[0]).attr('href');
				//console.log($(a[0]).attr('href'));
				//Get images
				const filename = `${result[i].filmID}.jpg`;
				const mybucket = storage.bucket(bucketName);
				const file = mybucket.file(filename);
				//let file = fs.createWriteStream(filename);
				await axios.get(imgurl, {
					headers:{
						'Referer': 'http://app2.atmovies.com.tw/poster/',
						'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
	
					},
					responseType:'stream'

								})
					.then((res)=>{
						res.data.pipe(file.createWriteStream({gzip:true}))
								.on('error', (err)=>console.log("Error writing to GCP:", err))
								.on('finish', ()=>{
									//file upload complete.
									console.log(`wrote file ${filename} to GCS`)
								})
					})
					.catch((err)=>{
						console.log(`Error getting ${imgurl}...: `, err);
					});

			})
			.catch((err)=>{
				console.log("Failed to get posters...: ",err);
			})
		
	}

}