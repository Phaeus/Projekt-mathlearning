import React,{Component} from 'react';
import {connect} from 'react-redux';

import { setIdsToValueArray ,getUser, getUserlist, logoutUser, getCollections} from '../../actions';
import history from '../../history';
import Header from '../Header';
import './User.css';

class User extends Component{
    constructor(props){
        super(props);
        this.state = {
            username:null,
            createdCollection: null
        }
    }
    
    async componentDidMount() {
        this.props.setIdsToValueArray();
        if (this.props.user.userlist === null) {
          await this.props.getUserlist();
        }
        if(this.props.collections.collectionlist === null){
            await this.props.getCollections();
        }
    
        const { username } = this.props.match.params;
        this.setState({username});
        if(this.props.user.user === null || this.props.user.user.username !== username){
            await this.props.getUser(username);
        }
        this.getCreatedCollections()
      }

      getCreatedCollections = () => {
        const collectionIds = this.props.user.user.createdCollection;
        console.log(collectionIds)
        let createdCollection = [];
        const allCollections = this.props.collections.collectionlist;
        console.log(allCollections)
        for (let i = 0; i < collectionIds.length; i++) {
            createdCollection[i] = allCollections.find(coll => coll.id === collectionIds[i]);
            console.log(createdCollection[i])
        }
        console.log(createdCollection)
        this.setState({createdCollection});
      }

      findCreator = (creatorId) => {
        const creator = this.props.user.userlist.find(user => user.id === creatorId).username;
        return creator;
      }

      handleDeleteOnClick = (event) => {
        event.stopPropagation();
        
      }

      handleEditOnClick = (event, collectionId) => {
        event.stopPropagation();
        history.push(`${this.state.username}/editCollection/${collectionId}`)
    }

    render(){
        const {createdCollection} = this.state;

        if(this.props.user.user === null || createdCollection === null ){
            return <div>Loading...</div>
        }
        else{
        return(
            <div>
                <Header />
                <div className="ui container">
                    createdCollection:
                    {createdCollection.map(collection => {
                        return(
                            <div className="ui segment" id="collection" key={collection.id}>
                                {collection.title} Anzahl Karten:{collection.cardIdList.length} Creator:{this.findCreator(collection.creatorId)} Modus:{collection.modus}
                                <i className="edit icon" id="edit" onClick={e => this.handleEditOnClick(e, collection.id)}></i>
                                <i className="trash alternate icon" id="delete" onClick={this.handleDeleteOnClick}></i>
                            </div>
                        )
                    })}
                    <button className="ui button" onClick={() => {this.props.logoutUser(); history.goBack()}}>Logout</button>
                </div>
            </div>
        )
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        collections: state.collections
    }
}

const mapDispatchToProps = {
    getUser:getUser,
    getUserlist: getUserlist,
    logoutUser,
    getCollections,
    setIdsToValueArray
};
export default connect(mapStateToProps, mapDispatchToProps)(User)