import React, {Component} from 'react';
import Collectionlist from './Collection/Collectionlist';
import Header from './Header';

export default class MainPage extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return(
        <div>
            <Header />
            <div className="ui container">
                <div className="ui segment">
                    <h1 className="ui header">Mathlearning: Challenge your mind!</h1>
                    <Collectionlist />
                </div>
            </div>
        </div>
        )
    }
}