import React, { Component } from 'react';
import axios from 'axios';
import TheTVHUB from '../Utils/thetvdbAPI.js';
import Episode from './episode.js';
import {ListGroup, Tabs, Tab, Glyphicon} from 'react-bootstrap';
import LOG from '../Utils/logger.js';

function EpisodeList(props) {
    if(props.serie === null || props.serie === undefined)
      return (<div></div>);
    else
      return(
        <div style={(props.serie.id === null) ? { visibility: 'hidden' } : { visibility: 'visible' }}>
          <h3 className="favList">{props.serie.serieName} - Episodes</h3>
          <Serie serie={props.serie} onSetWatched={props.updateWatchedEpisodes} />
        </div>
      );
  }

class Serie extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            shownSeason: 0,
            episodesList: [],
            loading: true
        };
    }

    getEpisodes = (serieID) =>{
        this.setState({loading:true});
        if(this.state.token === ''){
            LOG("getEpisodes Calling Login() for "+serieID)
            TheTVHUB.doLoginTVHUB().then(response => {this.setState({token: response.data.token});LOG("token stored in state")} ).then(
                response => {return axios.get(TheTVHUB.proxyURL+TheTVHUB.baseURL+'/series/'+serieID+'/episodes', {headers: {'Authorization': 'Bearer '+this.state.token, 'Accept-Language': 'en-US'}})}
            ).then(this.parseEpisodeList);
        } else {
            return axios.get(TheTVHUB.proxyURL+TheTVHUB.baseURL+'/series/'+serieID+'/episodes', {headers: {'Authorization': 'Bearer '+this.state.token, 'Accept-Language': 'en-US'}}).then(this.parseEpisodeList);
        }
    }
    parseEpisodeList = (response) =>
    {
        let episodesList = response.data.data.slice();
        episodesList.sort((a,b) => b.airedSeason - a.airedSeason || b.airedEpisodeNumber - a.airedEpisodeNumber);
        let listBySeason = [];
        episodesList.forEach(item => {
            if(listBySeason[item.airedSeason] === undefined){
                listBySeason[item.airedSeason] = [];
            }
            listBySeason[item.airedSeason].push(item);
        });

        this.setState({episodesList: listBySeason.slice(), shownSeason: listBySeason.length-1, loading:false});
        /*
        this.state.episodesList.forEach(function(element) {
            LOG("season: "+element.airedSeason+" / episode: "+element.airedEpisodeNumber+" - Name: "+element.episodeName+" Aired: "+element.firstAired);
        }, this);
        */
    }
    componentWillMount(){
        this.getEpisodes(this.props.serie.id);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.serie.id !== nextProps.serie.id){
            this.getEpisodes(nextProps.serie.id);
        }
    }
    onSetWatched = (serieID, seasonNumber, episodeNumber, firstAired) => {
        let episodes = [];
        let lastEpisodeWatched = firstAired;
        let newEpisodes = []
        this.state.episodesList[seasonNumber].forEach((episode) => {
            if(episode.airedSeason === seasonNumber && episode.airedEpisodeNumber <= episodeNumber){
                episodes.push(episode.airedEpisodeNumber);                
            }

            if(lastEpisodeWatched !== undefined && new Date(episode.firstAired).getTime() > new Date(lastEpisodeWatched).getTime() && new Date(episode.firstAired).getTime() <= new Date().getTime() )
                newEpisodes.push(episode);

        });
        this.props.onSetWatched(serieID, seasonNumber, episodes, newEpisodes);
    }
    render(){
        LOG("Called render method of Serie component");
        if(this.props.serie.id ===null)
            return null;
        const episodesList = this.state.episodesList.slice();
        let watchedEpisodes = (this.props.serie.watchedEpisodes===undefined)?[]:this.props.serie.watchedEpisodes;
        if(this.state.loading){
            LOG("showing Spinner");
            return(
                <div>
                    Loading... <Glyphicon glyph="repeat" bsClass="glyphicon glyphicon-repeat fast-right-spinner"/>
                </div>
            );
        }else {            
            const episodeTabs = episodesList.map(
            (season, index) => {
                let tabContent = season.map(
                            (element) => {
                                let elementWatched = false;
                                (watchedEpisodes.findIndex(x => x === element.airedSeason + 'x' + element.airedEpisodeNumber) > -1) ? (elementWatched = true) : (elementWatched = false);
                                return (
                                    <Episode watched={elementWatched} onSetWatched={this.onSetWatched} key={element.airedEpisodeNumber + "" + element.airedSeason} uniqueID={element.airedEpisodeNumber + "" + element.airedSeason} eventKey={element.episodeName} serieName={this.props.serie.serieName} episode={element} serieID={this.props.serie.id} />
                                )
                            })
                return (
                        <Tab unmountOnExit={true} key={season[0].airedSeason} eventKey={season[0].airedSeason} title={"Season "+ season[0].airedSeason}>{tabContent}</Tab>
                    );
            }
        );
        return (
                <ListGroup>
                <Tabs activeKey={this.state.shownSeason} onSelect={(shownSeason) => {this.setState({shownSeason})}} id="seasonsTab">
                    {episodeTabs}
                </Tabs>

                </ListGroup>
        );
    }
    }
}
export default EpisodeList;
//                    <Episode watched={elementWatched} onSetWatched={this.onSetWatched} key={element.airedEpisodeNumber+""+element.airedSeason} uniqueID={element.airedEpisodeNumber+""+element.airedSeason} eventKey={element.episodeName} serieName={this.props.serie.serieName} seasonNumber={element.airedSeason} episodeNumber={element.airedEpisodeNumber} episodeSummary={element.overview} episodeName={element.episodeName} serieID={this.props.serie.id}/>
