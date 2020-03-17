import React from 'react';
import Header from './Header'
import history from '../history'

export default function Help(){
    return(
        <div>
            <Header />
            <div className="ui container">
                <h1 className="ui header" style={{textAlign:"center"}}>Help</h1>
                <div className="ui segment" style={{borderColor:"grey", borderWidth:"3px"}}>
                    <h3>To Reset your Local Store type in "https://mathlearn1ng.herokuapp.com/clear"</h3>
                    <button className="ui big button" style={{textAlign:"center"}} onClick={() => history.goBack()}>Back</button>
                </div>
            </div>
        </div>
    )
}