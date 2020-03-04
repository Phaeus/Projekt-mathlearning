import React, { Component } from 'react';
import { connect } from 'react-redux';

import history from '../../history';
import { createCollection, getCollections, createCard, getCards, addCreatedCollection, getLastCollectionId, getUser} from '../../actions';
import CreateCardForm from '../Card/CreateCardForm';
import './CreateCollection.css';
import Header from '../Header';

class CreateCollection extends Component {
    constructor(props) {
        super(props)
        this.state={
                collectionTitle:"",
                toggleRandomRequest: false
         }
        this.onCollectionSubmit = this.onCollectionSubmit.bind(this);
    }
    async componentDidMount() {
        if(this.props.collections.collectionlist === null){
            await this.props.getCollections();
        }
        if (this.props.cards.cardlist === null) {
            await this.props.getCards();
        }
        if(this.props.user.user === null){
            await this.props.getUser();
        }
    }
    async onCollectionSubmit(cardArray, randomOrderBool) {
        const cardIds = this.setCardIds(cardArray);
        this.props.addCreatedCollection(this.props.collections.lastCollectionId+1);
        await this.props.createCollection({title: this.state.collectionTitle, randomOrderBool}, cardIds, this.props.user.user.id);
        await this.props.createCard(cardArray);
        history.push(`/`);
    }
    
    setCardIds = (cardArray) => {
        const lastId = parseInt(this.props.cards.lastId);
        let idList = [];
        for (let i = 1; i < cardArray.length+1; i++) {
            idList.push(lastId + i);
        }
        console.log(idList);
        return idList;
    }

    

    render() {
        const {collections} = this.props.collections;
        const {cards} = this.props.cards;
        if(collections === null || cards === null){
            return(
                <div> Loading...</div>
            )
        }
        else{
            console.log(this.props.cards);
            return(
                <div>
                <Header />
                <div className="ui container">
                    
                    <div className="ui segment">
                    <form onSubmit={this.onCollectionSubmit}>
                        <div className="ui input">
                        <input type="text" placeholder="Title" name="text" value={this.state.collectionTitle} onChange={e => this.setState({ collectionTitle: e.target.value })} />
                        </div>
                    </ form>
                        <CreateCardForm onSubmit={this.onCollectionSubmit} />
                    </div>
                    </div>
                </div>
            )
        }
    }

}

const mapStateToProps = state => {
    return {
        collections: state.collections,
        cards: state.cards,
        user: state.user
    }
}

const mapDispatchToProps = {
    createCollection:createCollection,
    getCollections:getCollections,
    getCards: getCards,
    createCard: createCard,
    addCreatedCollection:addCreatedCollection,
    getLastCollectionId,
    getUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection);