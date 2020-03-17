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
            <div className="ui container" >
            <h1 className="ui header" style={{textAlign:"center"}}>Challenge your mind!</h1>
                <div className="ui segment" style={{borderColor:"grey", borderWidth:"3px"}}>
                    <Collectionlist />
                </div>
            </div>
        </div>
        )
    }
}