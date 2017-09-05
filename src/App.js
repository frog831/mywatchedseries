import React, { Component } from 'react';
import './App.css';
import SeriesFinder from './Components/seriesFinder.js';
import EpisodeList from './Components/series.js';
import FavouriteList from './Components/favouriteList.js';
import {Grid, Col, Row, Glyphicon} from 'react-bootstrap';
import Auth from './Utils/Auth.js';
import Guid from 'guid';
import ToWatchList from './Components/toWatchList.js';
import LOG from './Utils/logger.js';

//Re-Base code
import base from './Utils/rebase.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        favouriteSeries: [],
        activeSerieID: -1,
        loading: true,
        user: null
    };
  }
updateActiveSerieID = (activeSerieID) =>{
  this.setState({activeSerieID});
}
syncData = () => {
  LOG("Syncing data");
  this.ref = base.syncState(this.state.favouriteSeriesCollectionID+'/favouriteSeries/', {
    context: this,
    state: 'favouriteSeries',
    asArray: true,
    onFailure: ((err) => {LOG("Error syncing data: "+err);}),    
    then() {
      this.setState({ loading: false });
    }
  });
}
isAuthenticated = (status, user) => {
  if(status){
    this.setState({ user });
    base.fetch('users/'+user.uid, {
      context: this,
      asArray: false
    }).then(data => {
      LOG("user Data "+data.favouriteSeriesCollectionID)
      if(data.favouriteSeriesCollectionID === undefined){
        let newGuid = Guid.raw();
        base.post('users/'+user.uid, {
          data: {favouriteSeriesCollectionID: newGuid}
        }).then(this.setState({favouriteSeriesCollectionID: newGuid}));  
      } else
        this.setState({favouriteSeriesCollectionID: data.favouriteSeriesCollectionID})
    }).then(() =>
      this.syncData()
    );
  } else {
    this.setState({user: null});
    base.removeBinding(this.ref);
  }
}

  updateFavouriteSeries = (update) => {
    if(update.length ===0)
      return;
    let newFavouriteSeriesList = this.state.favouriteSeries.slice();
    update.forEach(item => {
      if(!newFavouriteSeriesList.some(element => {return element.id === item.id}))
        newFavouriteSeriesList.push({'id':item.id, 'serieName': item.seriesName, 'lastWatched': new Date().getTime()});
    });
    this.setState(
      {favouriteSeries: newFavouriteSeriesList}
    );
  }

  updateWatchedEpisodes = (serieID, seasonNumber, episodes, newEpisodes) =>{
    let seriesToUpdate = this.state.favouriteSeries.slice();
    let itemToModify = seriesToUpdate[seriesToUpdate.findIndex(x => x.id === serieID)];
    itemToModify.watchedEpisodes = [];   
    itemToModify.newEpisodes = []; 
    itemToModify.lastWatched = new Date().getTime();
    episodes.forEach((episodeNumber) => {
      itemToModify.watchedEpisodes.push(seasonNumber+'x'+episodeNumber);      
    });
    /*
    newEpisodes.forEach((episodeNumber) => {
      itemToModify.newEpisodes.push(seasonNumber+'x'+episodeNumber);      
    });*/
    itemToModify.newEpisodes = newEpisodes;
    seriesToUpdate.sort((a,b) => b.lastWatched - a.lastWatched);
    
    this.setState({favouriteSeries: seriesToUpdate});
  }
  removeFavouriteSerie = (serieID) => {
    let listToRemove = this.state.favouriteSeries.slice();
    let serieIndex = listToRemove.findIndex(x => x.id === serieID);
    listToRemove.splice(serieIndex,1);
    this.setState({favouriteSeries: listToRemove});
  }

  render() {
    LOG("called render of App component");
    let index=this.state.favouriteSeries.findIndex(x => x.id === this.state.activeSerieID);
    return (
      <Grid fluid={true}>
        <Row bsClass="row row-match-my-cols">
          <Col xs={9} md={9}> <h1><Glyphicon glyph='search' />  MyWhatchedSeries </h1></Col>
          <Col xs={3} md={3}>
            <Auth isAuthenticated={this.isAuthenticated} />
          </Col>
        </Row>
        {(!this.state.user || this.state.loading) ?null:
        <Row bsClass="row mainLayout" >
          <Col xs={12}  md={3} mdPush={9}>
            <FavouriteList activeSerieID={this.state.activeSerieID} favouriteSeries={this.state.favouriteSeries} removeFavouriteSerie={this.removeFavouriteSerie} updateActiveSerieID={this.updateActiveSerieID} />
          </Col>
          <Col xs={12} md={9} mdPull={3}>
            <Row bsClass="row mainLayout">
              <Col md={12} xs={12}>
                <SeriesFinder onUpdateFavouriteSeries={this.updateFavouriteSeries} />
              </Col>
            </Row>
            <Row bsClass="row mainLayout">
              <Col md={12}>
                <ToWatchList favouriteSeries={(index>-1)?null:this.state.favouriteSeries} updateActiveSerieID={this.updateActiveSerieID}/>
                <EpisodeList serie={(index>-1)?this.state.favouriteSeries[index]:null} updateWatchedEpisodes={this.updateWatchedEpisodes}/>
              </Col>
            </Row>
          </Col>
        </Row>
        }
        <Row>
          <Col md={12}><small>&copy; Copyright. 2017 All rights reserved</small></Col>
        </Row>
      </Grid>
    );
  }
}



export default App;