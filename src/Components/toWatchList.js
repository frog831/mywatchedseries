import React, { Component } from 'react';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

class ToWatchList extends Component {

render(){
    if(this.props.favouriteSeries === null || this.props.favouriteSeries === undefined)
        return null;
    return(
        < div >      
        {this.props.favouriteSeries.map(serie => {
            if(serie.newEpisodes === undefined)
                return null;
            else
                return (
                    <Panel key={serie.id} collapsible defaultExpanded header={serie.serieName} bsStyle="primary">
                    <ListGroup fill>
                    {serie.newEpisodes.map((episode,index) => {
                        return(
                            <ListGroupItem key={index}><span className="episodeTitle">Episode {episode}</span></ListGroupItem>
                        );
                    })}
                    <a onClick={() => this.props.updateActiveSerieID(serie.id)} className="episodeTitle">Mark episodes of {serie.serieName} </a>
                    </ListGroup>
                </Panel>
                );
        })}
      </div >
    );
}
}

export default ToWatchList;