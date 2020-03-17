import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-rainbow-components'

import history from '../../history';
import { getCollection, getCollections, getUser, getCards, setGuestToNull} from '../../actions';
import './GameResults.css'
import Header from '../Header';

class GameResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bestPlayer: null,
            collectionId: null,
            seCollection: null,
            cards: null,
            userPoints: 0
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ collectionId: id })
        if (this.props.collections.collectionlist === null) {
            await this.props.getCollections()
        }
        if (this.props.cards.cardlist === null) {
            await this.props.getCards()
        }
        await this.props.getCollection(id);

        if (this.props.user.user === null && this.props.user.guest === null) {
            history.push(`/`)
        }
        if (this.props.collections.collection.modus !== "Learningmodus") {
            this.setBestPlayers()
        }
            await this.findUserPlayedCollection();
            if(this.state.seCollection !== null){
                this.findCardFromUser()
            }
    }

    componentWillUnmount(){
        this.props.setGuestToNull();
    }

    msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    findUserPlayedCollection = () => {
        let { user } = this.props.user
        let { collection } = this.props.collections
        let userPoints = 0;
        let seCollection = null
        if (user !== null && this.props.user.guest === null){
            user.playedCollection.reverse();
            userPoints = 0;
            seCollection = user.playedCollection.find(arr => arr.collectionId === collection.id)
            
        }
        else{
            seCollection = this.props.user.guest;
        }
        if (this.props.collections.collection.modus === "Countdownmodus") {
                for (let i = 0; i < seCollection.correctAnswerArray.length; i++) {
                    if (seCollection.correctAnswerArray[i].correct) {
                        userPoints = userPoints + 100;
                    }
                }
                if(seCollection.wholeTime > 0){
                    userPoints = userPoints + Math.round((seCollection.userTime / (seCollection.wholeTime * 1000)) * 2000);
                }
            }
        
        this.setState({ seCollection, userPoints })
    }

    findCardFromUser = () => {
        const { cardlist } = this.props.cards
        const { seCollection } = this.state;
        const {collection} = this.props.collections
        let cards = []
        if(this.props.collections.collection.modus !== "Learningmodus"){
            for (let i = 0; i < seCollection.correctAnswerArray.length; i++) {
                cards.push(cardlist.find(card => card.id === seCollection.correctAnswerArray[i].cardId))
            }
        }
        else{
            for (let i = 0; i  < collection.cardIdList.length; i++) {
                cards.push(cardlist.find(card => card.id === collection.cardIdList[i]))
            }
        }
        this.setState({ cards })
    }

    async setBestPlayers() {
        const { bestPlayers } = this.props.collections.collection;
        let bestPlayer = [];
        for (let i = 0; i < bestPlayers.length; i++) {
            if (bestPlayers[i].userId === null) {
                if (this.props.collections.collection.modus === "Timermodus") {
                    bestPlayer.push({ place: i + 1, userId: "---", time: "---" })
                }
                else {
                    bestPlayer.push({ place: i + 1, userId: "---", points: "---" })
                }
            }
            else {
                if (this.props.collections.collection.modus === "Timermodus") {
                    bestPlayer.push({ place: i + 1, userId: "" + this.getUsernameFromId(bestPlayers[i].userId), time: "" + this.msToTime(bestPlayers[i].time) })
                }
                else {
                    bestPlayer.push({ place: i + 1, userId: "" + this.getUsernameFromId(bestPlayers[i].userId), points: "" + bestPlayers[i].points })
                }
            }
        }
        await this.setState({ bestPlayer })
    }

    getUsernameFromId = (id) => {
        return this.props.user.userlist.find(user => user.id === id).username;
    }

    renderCards() {
        if (this.state.seCollection !== null && this.state.cards !== null && this.props.collections.collection.modus !== "Learningmodus") {
            return (
                <div style={{display:"flex"}}>
                    {this.state.seCollection.correctAnswerArray.map(arr => {
                        return (
                            <div key={arr.cardId}>
                                {arr.correct ? (
                                    <div className="ui segment" style={{height:"100px", width:"auto", marginBottom:"20px", marginRight:"10px", backgroundColor:"green"}}>
                                        <div>Question:  {this.state.cards.find(card => card.id === arr.cardId).question}</div>
                                        <div>User's answer: {arr.userAnswer}</div><div>Correct answer: {arr.correctAnswer}</div>
                                    </div>
                                ) : (
                                        <div className="ui segment" style={{height:"100px", width:"auto", marginBottom:"20px", marginRight:"10px", backgroundColor:"red"}}>
                                            <div>{this.state.cards.find(card => card.id === arr.cardId).question}</div>
                                            <div>userAnswer{arr.userAnswer}</div><div>CorrectAnswer{arr.correctAnswer}</div>
                                        </div>
                                    )}
                            </div>
                        )
                    }
                    )}
                </div>
            )
        }
        else if (this.state.seCollection !== null && this.state.cards !== null && this.props.collections.collection.modus === "Learningmodus") {
            return (
                <div>
                    <div>You played the Learningmodus. You can see the questions and the right answers.</div>
                    <div style={{display:"flex", flexDirection:"row", marginTop:"20px"}} >
                {this.state.cards.map(card => {
                        return(
                            <div>
                            <div className="ui segment" key={card.id} style={{marginRight:"10px", height:"100px", width:"100px"}}>
                                <div>Question:{card.question}</div>
                                <div>Answer:{card.answer}</div>
                            </div>
                            </div>
                        )
                    })}
                    </div>
                    </div>
            )
        }

        else { return( <div></div>) }
    }

    renderBestPlayers() {
        const { collection } = this.props.collections
        const { seCollection } = this.state;
        if (this.state.bestPlayer !== null && seCollection !== null) {
            return (
                <div>
                    {collection.modus === "Timermodus" ? (
                        <div>
                            <div>Your Time: {this.msToTime(seCollection.time)}</div>
                            <div>Timeaverage: {this.msToTime(collection.timeAverage)}</div>
                            <div>CorrectnessAverage: {collection.correctAnswerAverage}</div>
                            <Table data={this.state.bestPlayer} keyField="place">
                                <Column header="Place" field="place" />
                                <Column header="Player" field="userId" />
                                <Column header="Time" field="time" />
                            </Table>
                        </div>
                    ) : (<div />)}
                    {collection.modus === "Countdownmodus" ? (
                        <div>
                            <div>Your Points: {this.state.userPoints}</div>
                            <div>PointAverage:{collection.pointAverage}</div>
                            <div>CorrectnessAverage: {collection.correctAnswerAverage}</div>
                            <Table data={this.state.bestPlayer} keyField="place">
                                <Column header="Place" field="place" />
                                <Column header="Player" field="userId" />
                                <Column header="Points" field="points" />
                            </Table>
                        </div>
                    ) : (<div />)}
                </div>
            )
        }
        else {
            return <div></div>
        }
    }

    render() {
        const { collection } = this.props.collections
        if (collection === null) {
            return <div>Loading...</div>
        }
        else {
            return (
            <div>
                <Header />
                <div className="ui container">
                    <div className="ui segment" style={{borderColor:"Grey", borderWidth:"3px"}}>
                        <h1>Game Results</h1>
                        <div>{this.renderCards()}</div>
                        <div>{this.renderBestPlayers()}</div>
                        <div style={{marginTop:"20px"}}>
                        <button className="ui button" onClick={() => history.push(`/`)}>Back to Mainpage</button>
                        <button className="ui button" onClick={() => {history.push(`/collections/${this.state.collectionId}`)}}>Back to Gamemenu</button>
                        </div>
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
        user: state.user,
        cards: state.cards
    }
}

const mapDispatchToProps = {
    getCollection: getCollection,
    getUser,
    getCollections,
    getCards,
    setGuestToNull
};

export default connect(mapStateToProps, mapDispatchToProps)(GameResults);