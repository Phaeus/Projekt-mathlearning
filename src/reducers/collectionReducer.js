const initialState = {
    collectionlist:[{
      title: "Halla",
      randomOrderBool: true,
      cardIdList: [1, 2, 3],
      creatorId: 0,
      modus:"Countdownmodus",
      id: 1
    },
    {
      title: "Timermodus",
      randomOrderBool: false,
      cardIdList: [4, 5, 6],
      creatorId: 0,
      modus: "Timermodus",
      id: 2
    },
    {
      title: 'Learningmodus',
      randomOrderBool: true,
      cardIdList: [
        4,
        5,
        6
      ],
      creatorId: 0,
      modus: 'Learningmodus',
      id: 3
    }
    ],
    collection: null,
    lastCollectionId:3,
    collectionCounter:3
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case 'GET_COLLECTIONS':
        console.log(state);
        return {...state, collectionlist: action.payload};
      
      case 'GET_COLLECTION':
        const id = parseInt(action.payload);
        const collection = state.collectionlist.find(t => t.id === id);
        console.log(collection);
        return { ...state, collection:collection};

      case 'CREATE_COLLECTION':
        const createdCollection = action.payload.collection;
        let idNew = 0;
        for(let i = 0; i<state.collectionlist.length; i++) {
          if(idNew<state.collectionlist[i].id) {
            idNew = (state.collectionlist[i].id);
          }
        }
          const newCollection = {...createdCollection, id:idNew+1, cardIdList:createdCollection.cardIdList, creatorId: createdCollection.creatorId};
          let newList = state.collectionlist;
          newList.push(newCollection);
          console.log(state)
          return { ...state, collectionlist:newList, lastCollectionId: idNew+1, collectionCounter: state.collectionCounter+1}
      case 'GET_LAST_COLLECTION_ID':
        let lastId = 0;
        for(let i = 0; i<state.collectionlist.length; i++) {
          if(lastId<state.collectionlist[i].id) {
            lastId = (state.collectionlist[i].id);
          }
        }
        return {...state, lastCollectionId:lastId}
      default:
        return state;
    }
  };
  