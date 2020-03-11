
const initialState = {
    cardlist: [
    {question: "1", answer: "1", id: 1, displayTime: 3, showTimebar: true},
    {question: "2", answer: "2", id: 2, displayTime: 3, showTimebar: true},
    {question: "3", answer: "3", id: 3, displayTime: 3 , showTimebar: true},
    {question: "1+1", answer: "2", displayTime: 0, id: 4, showTimebar: false},
    {question: "2+2", answer: "4", displayTime: 0, id: 5, showTimebar: false},
    {question: "4+4", answer: "8", displayTime: 0, id: 6, showTimebar: false},
    {question: "2", answer: "2", displayTime: 0, id: 7, showTimebar: false},
    {question: "3", answer: "3", displayTime: 0, id: 8, showTimebar: false},
    {question: "4", answer: "4", displayTime: 0, id: 9, showTimebar: false}
  ],
    card: null,
    lastId:9,
    selectedEquation:null,
    idsToValueArray:null
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case 'GET_CARDS':
        console.log(state);
        return {...state, cardlist: action.payload};
      case 'GET_CARD':
        console.log(state);
        const id = parseInt(action.payload);
        const card = state.cardlist.find(t => t.id === id);
        return { ...state, card: card};

      case 'CREATE_CARD':
        let nId = state.lastId;
        const cardArray = action.payload;
        let nList = state.cardlist;

        for (let i = 0; i < cardArray.length; i++) {
          const card = {...cardArray[i], showTimebar:cardArray[i].showTimebar , id:nId+1};
          nId = nId+1;
          nList.push(card);
        }
        console.log(nId);
          return { ...state, cardlist:nList, lastId: nId}
      
      case 'UPDATE_CARD':
        const updatedIdArray = action.payload.cardIds.newCardIds;
        const potDelIds = action.payload.cardIds.deletedEl;
        const updatedCards = action.payload.cardArray;
        let oldCardlist = state.cardlist;
        let lastId = state.lastId;

        for (let i = 0; i < updatedIdArray.length; i++) {
          for (let a = 0; a < oldCardlist.length; a++) {
            if(updatedIdArray[i] === oldCardlist[a].id){
              oldCardlist[a] = updatedCards[i];
            }
            if(updatedIdArray[i] > lastId){
              updatedCards[i] = {...updatedCards[i], id: updatedIdArray[i]}
              oldCardlist.push(updatedCards[i])
              lastId = lastId+1;
            }
          }
        }
        for (let i = 0; i < potDelIds.length; i++) {
          oldCardlist = oldCardlist.filter(card => card.id !== potDelIds[i])
        }
        console.log(oldCardlist)
      return {...state, cardlist: oldCardlist, lastId}
      
      case 'CARD_IDS_TO_VALUE':
        const cardIds = action.payload;
        const cards = state.cardlist;
        let newCardArray = [];
          for (let i = 0; i < cardIds.length; i++) {
            newCardArray.push(cards.find(card => card.id === cardIds[i]));
          }
          console.log(newCardArray)
      return {...state, idsToValueArray:newCardArray}

      case 'SET_IDS_TO_VALUE_ARRAY':
        return {...state, idsToValueArray:null}
        
      case 'SET_SELECTED_EQUATION':
        const selectedEquation = action.payload;
        return {...state, selectedEquation}

      case 'DELETE_CARDS':
        const deleteCardIds = action.payload;
        let deletedCardList = state.cardlist;
        for (let i = 0; i < deleteCardIds.length; i++) {
          deletedCardList = deletedCardList.filter(card => card.id !== deleteCardIds[i]);
        }
        console.log(deletedCardList)
      return {...state, cardlist:deletedCardList}

      default:
        return state;
    }
  };
  