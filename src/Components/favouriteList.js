import React, { Component } from 'react';
import {Nav, NavItem, Badge, Glyphicon, Navbar} from 'react-bootstrap';

class FavouriteList extends Component {
    constructor() {
        super();
        this.state = {
           activeSerieID: -1,
           open: true
        };
    }
    render() {
        let favouriteList = this.props.favouriteSeries.slice();
        return(
            <div style={(favouriteList.length > 0) ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                <h3 className="favList" onClick={() => this.setState({open: !this.state.open})}>Favourite List</h3>
                <Nav bsStyle="pills" stacked onSelect={(selectedKey) => { this.props.updateActiveSerieID(selectedKey); this.setState({ activeSerieID: selectedKey }) }}>
                    <NavItem active={(this.state.activeSerieID === -1) ? true : false} key={-1} eventKey={-1} href="#">
                        Series to Watch
                    </NavItem>
                    {favouriteList.map((serie) => {
                        return (
                            <NavItem active={(this.state.activeSerieID === serie.id) ? true : false} key={serie.id} eventKey={serie.id} href="#">
                                {serie.serieName} <Badge>{(serie.newEpisodes !== undefined) ? serie.newEpisodes.length + " new" : null}</Badge> <Navbar.Link href="#" onClick={() => this.props.removeFavouriteSerie(serie.id)}><Glyphicon glyph="minus" /></Navbar.Link>
                            </NavItem>
                        );
                    })}
                </Nav>
            </div>
        );
    }
}

export default FavouriteList;
