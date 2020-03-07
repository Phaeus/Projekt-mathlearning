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
        7,
        8,
        9
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
          const newCollection = {...createdCollection, id:state.lastCollectionId+1, cardIdList:createdCollection.cardIdList, creatorId: createdCollection.creatorId};
          let newList = state.collectionlist;
          newList.push(newCollection);
          console.log(state)
      return { ...state, collectionlist:newList, lastCollectionId: state.lastCollectionId+1, collectionCounter: state.collectionCounter+1}
      case 'GET_LAST_COLLECTION_ID':
        let lastId = 0;
        for(let i = 0; i<state.collectionlist.length; i++) {
          if(lastId<state.collectionlist[i].id) {
            lastId = (state.collectionlist[i].id);
          }
        }
      return {...state, lastCollectionId:lastId}

      case 'UPDATE_COLLECTION':
        const updatedCollection = action.payload;
        let updatedCollectionlist = state.collectionlist;
        let index;
        for (let i = 0; i < updatedCollectionlist.length; i++) {
          if(updatedCollectionlist[i].id === updatedCollection.id){
            index = i;
          }
        }
        updatedCollectionlist.splice(index, 1, updatedCollection);
        console.log(updatedCollectionlist);
      return {...state, collectionlist: updatedCollectionlist}
      
      case 'DELETE_COLLECTION':
        const deleteCollectionId = action.payload;
        let deletedCollectionList = state.collectionlist;
        deletedCollectionList = deletedCollectionList.filter(coll => coll.id !== deleteCollectionId);
        console.log(deletedCollectionList)
      return {...state, collectionlist:deletedCollectionList}
      default:
        return state;
    }
  };
  