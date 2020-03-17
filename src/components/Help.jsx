import React from 'react';
import Header from './Header'

export default function Help(){
    return(
        <div>
            <Header />
            <div className="ui container">
                <h1 className="ui header" style={{textAlign:"center"}}>Help</h1>
                <div className="ui segment" style={{borderColor:"grey", borderWidth:"3px"}}>
                    <h1></h1>
                </div>
            </div>
        </div>
    )
}