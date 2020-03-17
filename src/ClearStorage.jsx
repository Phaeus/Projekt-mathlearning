import React, { Component } from 'react';
import history from './history'

export default class ClearStorage extends Component{

    render(){
        return(
            <div style={{textAlign:"center", marginTop:"200px"}} >
               <div>
               <button className="ui big button" onClick={() => {window.localStorage.clear(); window.location.reload();}}>Click here to clear the Storage</button>
                   </div> 
                <button className="ui big button" style={{marginTop:"20px"}} onClick={() => history.push(`/`)}>Go back to Mainpage</button>
            </div>
        )
    }
}