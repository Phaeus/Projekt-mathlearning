import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-rainbow-components'

import history from '../../history';
import { getCollection, getCollections, getUser, getCards } from '../../actions';
import './GameResults.css'

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
            this.findCardFromUser()
    }

    msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    findUserPlayedCollection = () => {
        let { user } = this.props.user
        let { collection } = this.props.collections
        let userPoints = 0;
        let seCollection = null
        if (user !== null && this.props.user.guest === null) {
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
            userPoints = userPoints + Math.round((seCollection.userTime / (seCollection.wholeTime * 1000)) * 2000);
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
        console.log(this.props.collections.collection)
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
        console.log(bestPlayer)
        await this.setState({ bestPlayer })
    }

    getUsernameFromId = (id) => {
        console.log(this.props.user)
        return this.props.user.userlist.find(user => user.id === id).username;
    }

    renderCards() {
        const {collection} = this.props.collections;
        console.log(collection, this.state.seCollection, this.state.cards)
        if (this.state.seCollection !== null && this.state.cards !== null && this.props.collections.collection.modus !== "Learningmodus") {
            return (
                <div className="card">
                    {this.state.seCollection.correctAnswerArray.map(arr => {
                        return (
                            <div key={arr.cardId}>
                                {arr.correct ? (
                                    <div className="correctAnswer">
                                        <div>{this.state.cards.find(card => card.id === arr.cardId).question}</div>
                                        <div>userAnswer{arr.userAnswer}CorrectAnswer{arr.correctAnswer}</div>
                                    </div>
                                ) : (
                                        <div className="wrongAnswer">
                                            <div>{this.state.cards.find(card => card.id === arr.cardId).question}</div>
                                            <div>userAnswer{arr.userAnswer}CorrectAnswer{arr.correctAnswer}</div>
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
            console.log("Halla")
            return (
                this.state.cards.map(card => {
                        return(
                            <div className="ui segment" key={card.id}>
                                <div>Question:{card.question}</div>
                                <div>Answer:{card.answer}</div>
                            </div>
                        )
                    })
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
                            <Table data={this.state.bestPlayer} keyField="Place">
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
                            <Table data={this.state.bestPlayer} keyField="Place">
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
                    <h1>Game Results</h1>
                    <div>{this.renderCards()}</div>
                    <div>{this.renderBestPlayers()}</div>
                    <button className="ui button" onClick={() => history.push(`/`)}>To List</button>
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
    getCards
};

export default connect(mapStateToProps, mapDispatchToProps)(GameResults);