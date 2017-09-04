import axios from 'axios';

class TheTVHUB {
    static baseURL = "https://api.thetvdb.com/";
    static proxyURL = "https://cors-anywhere.herokuapp.com/";
    static methods = {
        login: "login",
        search: "search/series?name=",
    };
    static doLoginTVHUB = () => {
        return axios.post(
            TheTVHUB.proxyURL+TheTVHUB.baseURL+TheTVHUB.methods.login,
            {
                "apikey": "39AF5265EBE4508A",
                "userkey": "39D1A7037C909CD8",
                "username": "frog831"
            }
        )
    }
}
export default TheTVHUB;