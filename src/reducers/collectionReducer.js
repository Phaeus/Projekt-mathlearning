const initialState = {
  collectionlist: [{
    title: "Halla",
    randomOrderBool: true,
    cardIdList: [1, 2, 3],
    creatorId: 0,
    modus: "Countdownmodus",
    description: "HALla",
    correctAnswerAverage: 2,
    playedBy: [0],
    bestPlayers: [{ userId: 0, points: 2000 }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }],
    player: 1,
    id: 1
  },
  {
    title: "Timermodus",
    randomOrderBool: false,
    cardIdList: [4, 5, 6],
    creatorId: 0,
    modus: "Timermodus",
    description: "HALla",
    correctAnswerAverage: 3,
    timeAverage: 2000,
    playedBy: [0],
    bestPlayers: [{ userId: 0, time: 2000 }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }],
    player: 1,
    id: 2
  },
  {
    title: 'Learningmodus',
    randomOrderBool: true,
    cardIdList: [
      7,
      8,
      9
    ],
    creatorId: 0,
    modus: 'Learningmodus',
    description: "HALla",
    playedBy: [0],
    player: 1,
    id: 3
  }
  ],
  collection: null,
  lastCollectionId: 3,
  collectionCounter: 3
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COLLECTIONS':
      console.log(state);
      return { ...state, collectionlist: action.payload };

    case 'GET_COLLECTION':
      const id = parseInt(action.payload);
      const collection = state.collectionlist.find(t => t.id === id);
      console.log(collection);
      return { ...state, collection: collection };

    case 'CREATE_COLLECTION':
      const createdCollection = action.payload.collection;
      let newCollection = null;
      if (createdCollection.modus === "Timermodus") {
        newCollection = {
          ...createdCollection,
          id: state.lastCollectionId + 1,
          cardIdList: createdCollection.cardIdList,
          creatorId: createdCollection.creatorId,
          playedBy: [], player: 0,
          bestPlayers: [{ userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }, { userId: null, time: null }],
          correctAnswerAverage: null, timeAverage: null, description: createdCollection.description
        };
      }
      else if (createdCollection.modus === "Countdownmodus") {
        newCollection = {
          ...createdCollection, id: state.lastCollectionId + 1, cardIdList: createdCollection.cardIdList, creatorId: createdCollection.creatorId, playedBy: [],
          player: 0, bestPlayers: [{ userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }, { userId: null, points: null }],
          correctAnswerAverage: null, description: createdCollection.description
        };
      }
      else {
        newCollection = { ...createdCollection, id: state.lastCollectionId + 1, cardIdList: createdCollection.cardIdList, creatorId: createdCollection.creatorId, playedBy: null, player: 0, description: createdCollection.description };
      }
      let newList = state.collectionlist;
      newList.push(newCollection);
      console.log(state)
      return { ...state, collectionlist: newList, lastCollectionId: state.lastCollectionId + 1, collectionCounter: state.collectionCounter + 1 }
    case 'GET_LAST_COLLECTION_ID':
      let lastId = 0;
      for (let i = 0; i < state.collectionlist.length; i++) {
        if (lastId < state.collectionlist[i].id) {
          lastId = (state.collectionlist[i].id);
        }
      }
      return { ...state, lastCollectionId: lastId }

    case 'UPDATE_COLLECTION':
      const updatedCollection = action.payload;
      let updatedCollectionlist = state.collectionlist;
      let index;
      for (let i = 0; i < updatedCollectionlist.length; i++) {
        if (updatedCollectionlist[i].id === updatedCollection.id) {
          index = i;
        }
      }
      updatedCollectionlist.splice(index, 1, updatedCollection);
      console.log(updatedCollectionlist);
      return { ...state, collectionlist: updatedCollectionlist }

    case 'DELETE_COLLECTION':
      const deleteCollectionId = action.payload;
      let deletedCollectionList = state.collectionlist;
      deletedCollectionList = deletedCollectionList.filter(coll => coll.id !== deleteCollectionId);
      console.log(deletedCollectionList)
      return { ...state, collectionlist: deletedCollectionList }

    case 'SET_COLLECTION_STATS':
      console.log("Payload",action.payload)
      const stats = action.payload;
      console.log("State",state)
      let statCollection = state.collectionlist.find(collection => collection.id === stats.collectionId);
      let correctAnswerAverage = statCollection.correctAnswerAverage;
      let playedBy = statCollection.playedBy;
      playedBy.push(stats.userId);
      if (statCollection.modus === "Timermodus") {
        let timeAverage = statCollection.timeAverage;
        if (timeAverage === null) {
          timeAverage = stats.time;
        }
        else {
          timeAverage = Math.round(((timeAverage + stats.time) / (statCollection.player + 1)) * 100) / 100;
        }
        let newCorrectAverage = 0;
        for (let i = 0; i < stats.correctAnswerArray.length; i++) {
          if (stats.correctAnswerArray[i].correct === true) {
            newCorrectAverage = newCorrectAverage + 1;
          }
        }
        if (correctAnswerAverage === null) {
          correctAnswerAverage = newCorrectAverage;
        }
        else {
          correctAnswerAverage = Math.round(((newCorrectAverage + correctAnswerAverage) / 2) * 100) / 100;
        }

        let bestPlayers = statCollection.bestPlayers;
        let newBestPlayers = []
        console.log(bestPlayers.length, newCorrectAverage, stats.correctAnswerArray, stats.time)
        if (newCorrectAverage === stats.correctAnswerArray.length) {
          let setted = false;
          for (let i = 0; i < bestPlayers.length; i++) {
            if (bestPlayers[i].time > stats.time && !setted) {
              newBestPlayers.push({ userId: stats.userId, time: stats.time });
              setted=true
              i = i-1
            }
            else if(bestPlayers[i].time === null && !setted){
              newBestPlayers.push({ userId: stats.userId, time: stats.time });
              setted = true
              i=i-1
            }
            else{
              newBestPlayers.push(bestPlayers[i])
            }
            console.log("BestPlayers:",newBestPlayers)
          }
          newBestPlayers.pop()
          statCollection = { ...statCollection, correctAnswerAverage, timeAverage, bestPlayers:newBestPlayers }
        }
        console.log("New Collection",statCollection)
      }
      else if (statCollection.modus === "Countdownmodus") {
        let correctCounter = 0;
        const maxTimepoints = 2000;
        let points=0;
        points = points + Math.round(( stats.userTime/(stats.wholeTime*1000))*maxTimepoints);
        console.log(stats.wholeTime,stats.userTime,points)
        for (let i = 0; i < stats.correctAnswerArray.length; i++) {
          if (stats.correctAnswerArray[i].correct === true) {
            correctCounter = correctCounter + 1;
            points = points +100;
          }
        }
        if (correctAnswerAverage === null) {
          correctAnswerAverage = correctCounter;
        }
        else {
          correctAnswerAverage = Math.round(((correctCounter + correctAnswerAverage) / 2) * 100) / 100;
        }

        let bestPlayers = statCollection.bestPlayers;
        let newBestPlayers = []
        let setted = false;
          for (let i = 0; i < statCollection.bestPlayers.length; i++) {
            if (bestPlayers[i].points < points && !setted) {
              newBestPlayers.push({ userId: stats.userId, points: points});
              setted=true
              i = i-1
            }
            else if(bestPlayers[i].points === null && !setted){
              newBestPlayers.push({ userId: stats.userId, points: points });
              setted = true
              i=i-1
            }
            else{
              newBestPlayers.push(bestPlayers[i])
            }

            /*
            if (bestPlayers[i].points >= points) {
              p1 = bestPlayers.splice(0, i)
              p2 = bestPlayers.splice(i, bestPlayers.length)
              bestPlayers = p1.concat({ userId: stats.userId, points: points }, p2);
              bestPlayers.pop();
              break;
            }
            else if (bestPlayers[i].points === null) {
              bestPlayers[i] = { userId: stats.userId, points: points }
              break
            } */
          }
          newBestPlayers.pop()
        statCollection = { ...statCollection, correctAnswerAverage, bestPlayers: newBestPlayers }
      }

      statCollection = { ...statCollection, player: statCollection.player + 1, playedBy: playedBy }
      let changeIndex;
      let nCollectionlist = state.collectionlist;
      for (let i = 0; i < nCollectionlist.length; i++) {
        if (nCollectionlist[i].id === statCollection.id) {
          changeIndex = i;
        }
      }
      nCollectionlist.splice(changeIndex, 1, statCollection);
      console.log(nCollectionlist)
      return { ...state, collectionlist: nCollectionlist }
    default:
      return state;
  }
};
