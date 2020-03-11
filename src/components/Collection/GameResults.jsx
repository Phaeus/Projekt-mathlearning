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
            collectionId:null,
            seCollection:null,
            cards:null
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({collectionId:id})
        if(this.props.collections.collectionlist=== null){
            await this.props.getCollections()
        }
        if(this.props.cards.cardlist === null){
            await this.props.getCards()
        }
        await this.props.getCollection(id);
        console.log(this.props.collections.collection)

        if (this.props.user.user === null) {
            history.push(`/`)
        }
        if (this.props.collections.collection.modus !== "Learningmodus") {
            this.setBestPlayers()
        }
        if(this.props.user.user !== null){
            this.findUserPlayedCollection();
            this.findCardFromUser()
        }
    }

    msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    findUserPlayedCollection = () => {
        const { user } = this.props.user
        let {collection} = this.props.collections
        console.log(user.playedCollection.find(arr => arr.collectionId === collection.id))
        this.setState({seCollection: user.playedCollection.find(arr => arr.collectionId === collection.id)})
    }

    findCardFromUser = () =>{
        const {cardlist} = this.props.cards
        const {seCollection} = this.state;
        let cards = []
        for (let i = 0; i < seCollection.correctAnswerArray.length; i++) {
            cards.push(cardlist.find(card => card.id === seCollection.correctAnswerArray[i].cardId))
        }
        this.setState({cards})
    }

    setBestPlayers = () => {
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
        this.setState({ bestPlayer })
    }

    getUsernameFromId = (id) => {
        console.log(this.props.user)
        return this.props.user.userlist.find(user => user.id === id).username;
    }

    renderCards() {
        const { user } = this.props.user
        if(this.state.seCollection !== null && this.state.cards !== null){
        return (
            <div className="card">
                {this.state.seCollection.correctAnswerArray.map( arr=> {
                    return (
                        <div key={arr.cardId}>
                        {arr.correct ? (
                            <div className="correctAnswer">
                                <div>{this.state.cards.find(card => card.id === arr.cardId).question}</div>
                                <div>userAnswer{arr.userAnswer}CorrectAnswer{arr.correctAnswer}</div>
                            </div>
                        ):(
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
        )}
        else{return <div></div>}
    
    }

    render() {
        const { collection } = this.props.collections
        if (collection === null || this.state.bestPlayer === null) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div>
                    <h1>Game Results</h1>
                    <div>{this.renderCards()}</div>
                    {collection.modus === "Timermodus" ? (
                        <div>
                            {console.log(this.props.collections.collection, this.state)}
                            <div>Timeaverage: {this.msToTime(collection.timeAverage)}</div>
                            <Table data={this.state.bestPlayer} keyField="{collection.id}">
                                <Column header="Place" field="place" />
                                <Column header="Player" field="userId" />
                                <Column header="Time" field="time" />
                            </Table>
                        </div>
                    ) : (<div />)}
                    {collection.modus === "Countdownmodus" ? (
                        <div>
                            <Table data={this.state.bestPlayer} keyField="g">
                                <Column header="Place" field="place" />
                                <Column header="Player" field="userId" />
                                <Column header="Points" field="points" />
                            </Table>
                        </div>
                    ) : (<div />)}
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