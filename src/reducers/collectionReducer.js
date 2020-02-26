const initialState = {
    collectionlist:[{
      id: 1,
      title: "Halla",
      cardIdList: [1, 2, 3],
      randomOrderBool: true}],
    collection: null,
    lastCollectionId:1,
    collectionCounter:1
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
        let idNew = 0;
        for(let i = 0; i<state.collectionlist.length; i++) {
          if(idNew<state.collectionlist[i].id) {
            idNew = (state.collectionlist[i].id);
          }
        }
          const newCollection = {...action.payload.collection, id:idNew+1, cardIdList:action.payload.cardIdList};
          let newList = state.collectionlist;
          newList.push(newCollection);
          return { ...state, collectionlist:newList, lastCollectionId: idNew}
      case 'GET_LAST_COLLECTION_ID':
        let lastId = 0;
        for(let i = 0; i<state.collectionlist.length; i++) {
          if(lastId<state.collectionlist[i].id) {
            lastId = (state.collectionlist[i].id);
          }
        }
        return {...state, lastCollectionId:lastId, collectionCounter: state.collectionCounter+1}
      default:
        return state;
    }
  };
  