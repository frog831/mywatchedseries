import axios from 'axios';

class TheTVHUB {
    constructor() {
        if (!!TheTVHUB.instance) {
            return TheTVHUB.instance;
        }

        TheTVHUB.instance = this;
        return this;
    }


    static baseURL = "https://api.thetvdb.com/";
    static proxyURL = "https://cors-anywhere.herokuapp.com/";
    static methods = {
        login: "login",
        search: "search/series?name=",
    };
    isLoggedInTVHUB = () => {return this.token !== undefined;}
    doLoginTVHUB = () => {
        if (this.isLoggedInTVHUB())
            return this.loginPromise;
        if (this.loginPromise !== undefined)
            return this.loginPromise;
        else
        {
            this.loginPromise = axios.post(
                TheTVHUB.proxyURL + TheTVHUB.baseURL + TheTVHUB.methods.login,
                {
                    "apikey": "39AF5265EBE4508A",
                    "userkey": "39D1A7037C909CD8",
                    "username": "frog831"
                }
            ).then(resp => this.token = resp.data.token)
            return this.loginPromise;
        }
    }
    getEpisodesList = async (serieID) => {
        if(!this.token)
            throw new Error("you should first login to theTVHub, can't search a serie's EpisodeList");

        let response = await axios.get(
            TheTVHUB.proxyURL+TheTVHUB.baseURL+'/series/'+serieID+'/episodes', 
            {headers: {'Authorization': 'Bearer '+this.token, 'Accept-Language': 'en-US'}}
        )
        let page = response;
        while(page.data.links.next != null)
        {
            page = await axios.get(
                TheTVHUB.proxyURL+TheTVHUB.baseURL+'/series/'+serieID+'/episodes?page='+page.data.links.next, 
                {headers: {'Authorization': 'Bearer '+this.token, 'Accept-Language': 'en-US'}}
            )
            response.data.data = response.data.data.concat(page.data.data);
        }
        return response;
        
    }

    getSerieID = async(serieName) => {
        if(!this.token)
            throw new Error("you should first login to theTVHub, can't search a serie's SerieID");
        try{
            return await axios.get(TheTVHUB.proxyURL + TheTVHUB.baseURL + TheTVHUB.methods.search + serieName, { headers: { 'Authorization': 'Bearer ' + this.token, 'Accept-Language': 'en-US' } });
        } catch (error) {
            throw new Error("got an error:" + error.response); 
        }
    }
}
export default TheTVHUB;