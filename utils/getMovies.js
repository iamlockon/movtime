const cheerio = require('cheerio');
const axios = require('axios');
/**
 * Crawl film ID ():
 * http://www.atmovies.com.tw/movie/now/1/
 * $('#quickSelect select option')
 * ex:
 * NOTE: first element is not movie title.
 * <option value="http://www.atmovies.com.tw/movie/{filmID}/">{film title(ZH_TW)}</option>  
 *
 * @returns {Array<Object>}    
 */

async function getFilmID() {
    try{
        const res = await axios.get('http://www.atmovies.com.tw/movie/now/1/');
        let $ = cheerio.load(res.data);
        return $('#quickSelect select option').map((index, obj)=>{
            if( index===0 ) return;
            return { 
                     filmID: $(obj).attr('value').split('/')[4],
                }
        }).get();
    }catch(err) {
        console.error("Failed to get Error ID: " ,err);
    }
}

/**
 * #Crawl Movie data and use MoviesDAO to save them.
 *  http://www.atmovies.com.tw/movie/{filmID}/
 * 
 * @params {Array<Object>} data 
 */
 function getMovieData(data) { 
    const ret = [];
    
    data.forEach((ele) => {
        ret.push(new Promise(async (resolve, reject) => {
            let $ = null;
            try{
                const res = await axios.get(`http://www.atmovies.com.tw/movie/${ele.filmID}/`);
                $ = cheerio.load(res.data);
            }catch(e) {
                reject(`Failed to get ${ele.filmID} data: `, e);
            }
            const overview = $('#filmTagBlock span')[2].firstChild.data.trim();
            const length = $('#filmTagBlock span .runtime li')[0].firstChild.data.split('：')[1];

            const classN = $('.filmTitle img')[0];
            const className = classN !== undefined ? classN.attribs.src.split('images/')[1].toLowerCase() : ""; 
            let classing;
            switch (className) {
                case 'cer_p.gif':
                    classing = "保護級";
                    break;
                case 'cer_g.gif':
                    classing = "普遍級";
                    break;
                case 'cer_f2.gif': case 'cer_pg.gif':
                    classing = "輔導十二歲級";
                    break;
                case 'cer_f5.gif':
                    classing = "輔導十五歲級";
                    break;
                case 'cer_r.gif':
                    classing = "限制級";
                    break;
                default:
                    classing = "無資料";
            }
            const teaser_uri = $('.video_view iframe')[0];
            resolve({
                title: $('.filmTitle')[0].childNodes[2].data.trim(),
                filmID : ele.filmID,
                overview: overview,
                length: length,
                teaser_uri: (teaser_uri !== undefined ? teaser_uri.attribs.src : ""),
                classing: classing,
            });
        }));            
    });
    return Promise.all(ret);
 }

//Run the program
module.exports = async function getMovies(moviesDAO) {
    try {
        const data = await getFilmID();
        const md = await getMovieData(data);
        console.log("DELE");
        moviesDAO.deleteAll()
          .then(async ()=>{
            //console.log("Expect 0: ", await moviesDAO.docCount());
            return moviesDAO.insertMany(md);
          })
          .catch((e) => console.log(e));
        
    }catch(err) {
        console.error("Failed to getFilmID/MovieData or dump movies data to DB: ", err);
    }        
}

