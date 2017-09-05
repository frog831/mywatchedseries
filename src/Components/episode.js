import React, { Component } from 'react';
import { Panel, Glyphicon ,Button, ListGroupItem, Row, Col } from 'react-bootstrap';
import LOG from '../Utils/logger.js';

class Episode extends Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }
    render(){
        const {serieName,episode, serieID} = this.props;
        LOG("Call render method Episode");
        return(
            <Row>
              <Col xs={12} md={12}>
                <ListGroupItem key={this.props.uniqueID}>
                <Row bsStyle={(this.props.watched)?"match-my-cols episodeWatched":"match-my-cols"}>
                    <Col xs={8} md={8}>
                        <div onClick={() => this.setState({ open: !this.state.open })}  className="clickable">
                            <span className="episodeTitle">{serieName+" - "+episode.airedSeason+"x"+episode.airedEpisodeNumber+" - "+episode.episodeName}</span>
                        </div>
                    </Col>
                    <Col xs={2} md={2}> 
                        <small><em>{episode.firstAired}</em></small>
                    </Col>
                    <Col xs={2} md={2}>
                        <Button onClick={() => this.props.onSetWatched(serieID, episode.airedSeason, episode.airedEpisodeNumber,episode.firstAired)} disabled={(new Date(episode.firstAired).getTime() > new Date().getTime())?true:false}><Glyphicon bsStyle="episodeButton" glyph={(this.props.watched)?"minus":"plus"} /></Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                        <Panel collapsible expanded={this.state.open} bsClass="episodeList">
                            {(episode.overview===null)?"Episode Summary not available":episode.overview}
                        </Panel>
                    </Col>
                </Row>
                </ListGroupItem>
                </Col>
            </Row>
        );
        /*
        return (
            <Panel  header={this.props.serieName+" - "+this.props.seasonNumber+"x"+this.props.episodeNumber+" - "+this.props.episodeName} eventKey={this.props.eventKey} key={this.props.key} {...props} >
                <p>{this.props.episodeSummary}</p>
            </Panel>
        );
*/        
    }


}
export default Episode;