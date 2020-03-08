import React, { Component } from 'react';
import { connect } from 'react-redux';
import {RadioButtonGroup} from 'react-rainbow-components';

import history from '../../history';
import { cardIdsToValue, updateCollection, getCollection, updateCard, getCards, addCreatedCollection, getLastCollectionId, getUser} from '../../actions';
import Header from '../Header';
import { titleInputVali } from '../ValidationHelper';
import EditCardForm from '../Card/EditCardForm';

const modi = [
    {value: "Countdownmodus", label: "Countdownmodus"},
    {value: "Timermodus", label: "Timermodus"},
    {value: "Learningmodus", label: "Learningmodus"}
]

class EditCollection extends Component {
    constructor(props) {
        super(props)
        this.state={
                collectionTitle:"",
                toggleRandomRequest: false,
                modus: "Countdownmodus",
                showValidation: false,
                lastId:null
         }
        this.onCollectionSubmit = this.onCollectionSubmit.bind(this);
        this.handleModusChange = this.handleModusChange.bind(this);
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        if(this.props.collections.collection === null || this.props.collections.collection.id !== id){
            await this.props.getCollection(id);
            this.setState({modus:this.props.collections.collection.modus})
        }
        if (this.props.cards.cardlist === null) {
            await this.props.getCards();
        }
        if(this.props.user.user === null){
            await this.props.getUser();
        }
        if(this.props.cards.idsToValueArray === null){
            await this.props.cardIdsToValue(this.props.collections.collection.cardIdList);
        }
        this.setTitle();
    }

    //Das löschen von Karten funktioniert noch nicht

    async onCollectionSubmit(cardArray, randomOrderBool) {
        const cardIds = this.setCardIds(cardArray);
        console.log(cardIds)
        if(titleInputVali(this.state.collectionTitle) === null){
            this.props.updateCollection({title: this.state.collectionTitle, randomOrderBool, cardIdList:cardIds.newCardIds, creatorId:this.props.user.user.id, modus: this.state.modus, id: Number(this.props.match.params.id)});
            this.props.updateCard({cardIds, cardArray});
            history.push(`/`);
        }
        else{
            this.setState({showValidation: true});
        }
    }

    setTitle = () => {
        const collection = this.props.collections.collection;
        this.setState({collectionTitle: collection.title})
    }
     // hier ist ein problem
    setCardIds = (cardArray) => {
        console.log(cardArray)
        let cardIds1= [];
        let cardIds2 = [];
         //IDs von edititierer Collection
         const oldCardIds2 = this.props.collections.collection.cardIdList;
        let oldCardIds1 = this.props.collections.collection.cardIdList;

        let lastCardId = parseInt(this.props.cards.lastId);

        let newEl = [];
        let deletedEl = this.props.collections.collection.cardIdList;

        let newCardIds = this.props.collections.collection.cardIdList;

        for (let i = 0; i < cardArray.length; i++) {
            console.log(cardIds1, cardIds2)
            cardIds1.push(cardArray[i].id)
        }
        cardIds2 = cardIds1;
        for (let i = 0; i < oldCardIds2.length; i++) {
            newEl = cardIds1.filter(a => a !== oldCardIds2[i])
            cardIds1 = newEl;

            deletedEl = oldCardIds1.filter(a => a !== cardIds2[i])
            oldCardIds1 = deletedEl
        }
        for (let i = 0; i < deletedEl.length; i++) {
            newCardIds = newCardIds.filter(card => card !== deletedEl[i])
        }
        
        for (let i = 0; i < newEl.length; i++) {
            newEl[i] = lastCardId +1; lastCardId = lastCardId+1
            newCardIds.push(newEl[i])
        }
        console.log(newCardIds)
        return {newCardIds, deletedEl};
    }

    handleModusChange = (event) => {
        event.preventDefault();
        console.log(event.target.value)
        return this.setState({modus: event.target.value});
    }

    renderModusButtons(){
        console.log(this.props.collections.collection.modus)
        return(
            <div>
                <RadioButtonGroup 
                    id="radio-button-group-component-1"
                    options={modi}
                    value={this.state.modus}
                    onChange={this.handleModusChange}
                />
            </div>
        )
    }

    renderValidation(){
        const {collectionTitle} = this.state;
        const potError = titleInputVali(collectionTitle)
        if(potError !== null){
            return(
                <div>
                    {potError.label}
                </div>
            )
        }
        else{
            return <div/>
        }
    }

    handleTitleChange = (event) => {
        event.preventDefault();
        this.setState({ collectionTitle: event.target.value });
        if(titleInputVali(event.target.value) !== null){
            this.setState({showValidation:true});
        }
    }

    findLastIdInIdArray = (idArray) => {
        let lastId = -1;
        for (let i = 0; i < idArray.length; i++) {
            if(idArray[i] > lastId){
                lastId = idArray[i];
            }
        }
        return lastId;
    }

    findLastId = () => {
        let lastId = -1;
        console.log(this.props.cards.idsToValueArray)
        for (let i = 0; i < this.props.cards.idsToValueArray.length; i++) {
            if(this.props.cards.idsToValueArray[i].id > lastId){
                lastId = this.props.cards.idsToValueArray[i].id;
            }
            console.log(this.props.cards.idsToValueArray[i].id)
        }
        console.log(lastId)
        return lastId
    }
    
    render() {
        const {collections} = this.props.collections;
        const {cards} = this.props.cards;
        if(collections === null || cards === null || this.props.cards.idsToValueArray === null){
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
                        <input type="text" placeholder="Title" name="text" value={this.state.collectionTitle} onChange={this.handleTitleChange} />
                        {this.state.showValidation ?(this.renderValidation()):(<div/>)}
                        </div>
                    </ form>
                    {this.renderModusButtons()}
                    {console.log(this.props.cards.idsToValueArray)}
                        <EditCardForm lastId={this.findLastId()} randomOrderBool={this.props.collections.collection.randomOrderBool} cardArray={this.props.cards.idsToValueArray} onSubmit={this.onCollectionSubmit} modus={this.state.modus} showValidation={this.state.showValidation}/>
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
    updateCollection:updateCollection,
    getCollection:getCollection,
    getCards: getCards,
    updateCard: updateCard,
    addCreatedCollection:addCreatedCollection,
    getLastCollectionId,
    getUser,
    cardIdsToValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCollection);