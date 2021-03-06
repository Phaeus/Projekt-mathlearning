import React,{Component} from 'react';
import {connect} from 'react-redux';

import { setIdsToValueArray ,getUser, getUserlist, logoutUser, getCollections, deleteCards, deleteCollection, deleteCreatedCollection, deletePlayedCollection} from '../../actions';
import history from '../../history';
import Header from '../Header';
import './User.css';

class User extends Component{
    constructor(props){
        super(props);
        this.state = {
            username:null,
            createdCollection: null,
            playedCollection: null,
            loginSuccess:false,
            user:null
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
        await this.props.getUser(username);


        if(this.props.user.loginSuccess){
            this.setState({loginSuccess: this.props.user.loginSuccess})
            this.getCollections(this.props.user.user.createdCollection, "created");
            this.getCollections(this.props.user.user.playedCollection, "played");
            this.setState({user:this.props.user.user})
        }
        else{
            history.push(`/`)
            this.setState({createdCollection: undefined})
            this.setState({playedCollection: undefined})
            this.setState({user: undefined})
        }
      }

      componentDidUpdate(){
          if(!this.props.user.loginSuccess){
              history.push(`/`)
          }
      }

      getCollections = (collections, whichCollection) => {
        const collectionIds = collections;
        let selectedCollection = [];
        const allCollections = this.props.collections.collectionlist;
        if(whichCollection === "created"){
            for (let i = 0; i < collectionIds.length; i++) {
                selectedCollection.push(allCollections.find(coll => coll.id === collectionIds[i]));
            }
            this.setState({createdCollection: selectedCollection});
        }
        else{
            for (let i = 0; i < collectionIds.length; i++) {
                selectedCollection.push(allCollections.find(coll => coll.id === collectionIds[i].collectionId));
            }
            this.setState({playedCollection: selectedCollection})
        }
      }

      findCreator = (creatorId) => {
        const creator = this.props.user.userlist.find(user => user.id === creatorId).username;
        return creator;
      }

      async handleDeleteOnClick(event, collectionId, cardIds){
        event.stopPropagation();
        await this.props.deleteCollection(collectionId);
        await this.props.deleteCreatedCollection(collectionId);
        await this.props.deletePlayedCollection(collectionId);
        await this.props.deleteCards(cardIds);
        this.setState({createdCollection: this.props.user.user.createdCollection.filter(coll => coll === collectionId)})
      }

      handleEditOnClick = (event, collectionId) => {
        event.stopPropagation();
        history.push(`${this.state.username}/editCollection/${collectionId}`)
    }
    

 
    renderCreatedCollection(){
        if(this.state.createdCollection.length === 0){
            return(
                <div>
                    No Collection created yet
                </div>
            )
        }
        else if(this.state.createdCollection !== null){
            return(
                <div>
                {this.state.createdCollection.map(collection => {
                    return(
                        <div className="ui segment" key={collection.id} onClick={() => {history.push(`/collections/${collection.id}`)}}>
                             <div  className="userCollection">
                            <div className="item">
                            {collection.title}
                            </div> 
                            <div className="item">
                            Anzahl Karten:{collection.cardIdList.length}
                            </div>
                            <div className="item">Creator:{this.findCreator(collection.creatorId)}</div> 
                            <div className="item">Modus:{collection.modus}</div>
                            <div className="edit-delete">
                                <i className="edit icon" id="edit" onClick={e => this.handleEditOnClick(e, collection.id)}></i>
                                <i className="trash alternate icon" id="delete" onClick={e => this.handleDeleteOnClick(e, collection.id, collection.cardIdList)}></i>
                                </div>
                        </div>
                        </div>
                    )
                })} </div>
            )
        }
        else{
            return <div/>
        }
    }

    renderPlayedCollection(){
        if(this.state.playedCollection.length === 0){
            return(
                <div>No Collection played yet!</div>
            )
        }
        else if(this.state.playedCollectionCollection !== null){
            return(
                <div>
                {this.state.playedCollection.map(collection => {
                    return(
                        <div className="ui segment" key={collection.collectionId} onClick={() => {history.push(`/collections/${collection.id}`)}}>
                            <div  className="userCollection">
                            <div className="item">
                            {collection.title}
                            </div> 
                            <div className="item">
                            Anzahl Karten:{collection.cardIdList.length}
                            </div>
                            <div className="item">Creator:{this.findCreator(collection.creatorId)}</div> 
                            <div className="item">Modus:{collection.modus}</div>
                            </div>
                        </div>
                    )
                })} </div>
            )
        }
        else{
            return <div/>
        }
    }

    render(){
        if(this.state.user === null){
            return <div>Loading...</div>
        }
        else{
        return(
            <div>
                <Header />
                <div className="ui container">
                <div className="ui secondary header" style={{marginTop:"20px"}}>Created Collections:</div>
                    {this.renderCreatedCollection()}
                    <div className="ui secondary header" style={{marginTop:"20px"}}>Played Collections:</div>
                    {this.renderPlayedCollection()}
                    <button className="ui button" style={{marginTop:"20px"}} onClick={() => {this.props.logoutUser(); history.goBack()}}>Logout</button>
                    <button className="ui button" style={{marginTop:"20px"}} onClick={() => {history.push(`/`)}}>Back to Mainmenu</button>
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
    setIdsToValueArray,
    deleteCollection,
    deleteCreatedCollection,
    deletePlayedCollection,
    deleteCards
};
export default connect(mapStateToProps, mapDispatchToProps)(User)