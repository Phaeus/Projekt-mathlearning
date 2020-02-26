import React, { Component } from 'react';
import {connect} from 'react-redux';

import history from '../../history';
import {getCollection, getCards} from '../../actions';

class GameResults extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
        <div>
            <h1>Game Results</h1>
            <button className="ui button" onClick={() => history.push(`/`)}>Back</button>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        collections: state.collections,
        cards: state.cards
    }
}

const mapDispatchToProps = {
    getCollection:getCollection,
    getCards: getCards,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameResults);