import React, { Component } from 'react';
import { connect } from 'react-redux';
import {RadioButtonGroup} from 'react-rainbow-components';

import history from '../../history';
import { createCollection, getCollections, createCard, getCards, addCreatedCollection, getLastCollectionId, getUser} from '../../actions';
import CreateCardForm from '../Card/CreateCardForm';
import './CreateCollection.css';
import Header from '../Header';
import { titleInputVali } from '../ValidationHelper';

const modi = [
    {value: "Countdownmodus", label: "Countdownmodus"},
    {value: "Timermodus", label: "Timermodus"},
    {value: "Learningmodus", label: "Learningmodus"}
]

class CreateCollection extends Component {
    constructor(props) {
        super(props)
        this.state={
                collectionTitle:"",
                toggleRandomRequest: false,
                modus: "Countdownmodus",
                showValidation: false
         }
        this.onCollectionSubmit = this.onCollectionSubmit.bind(this);
        this.handleModusChange = this.handleModusChange.bind(this);
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
        if(titleInputVali(this.state.collectionTitle) === null){
            await this.props.addCreatedCollection(this.props.collections.lastCollectionId+1);
            await this.props.createCollection({title: this.state.collectionTitle, randomOrderBool, cardIdList:cardIds, creatorId:this.props.user.user.id, modus: this.state.modus});
            this.props.createCard(cardArray);
            history.push(`/`);
        }
        else{
            this.setState({showValidation: true});
        }
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

    handleModusChange = (event) => {
        event.preventDefault();
        return this.setState({modus: event.target.value});
    }

    renderModusButtons(){
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
                        <input type="text" placeholder="Title" name="text" value={this.state.collectionTitle} onChange={this.handleTitleChange} />
                        {this.state.showValidation ?(this.renderValidation()):(<div/>)}
                        </div>
                    </ form>
                    {this.renderModusButtons()}
                        <CreateCardForm onSubmit={this.onCollectionSubmit} modus={this.state.modus} showValidation={this.state.showValidation}/>
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