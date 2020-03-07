
const initialState = {
    cardlist: [
    {question: "1", answer: "39", id: 1, displayTime: 3, showTimebar: true},
    {question: "2", answer: "25", id: 2, displayTime: 3, showTimebar: true},
    {question: "3", answer: "100", id: 3, displayTime: 3 , showTimebar: true},
    {question: "1+1", answer: "2", displayTime: 0, id: 4, showTimebar: false},
    {question: "2+2", answer: "4", displayTime: 0, id: 5, showTimebar: false},
    {question: "4+4", answer: "8", displayTime: 0, id: 6, showTimebar: false},
    {question: "sdfg", answer: "sdfgggfd", displayTime: 0, id: 7, showTimebar: false},
    {question: "fgf", answer: "ghfvb", displayTime: 0, id: 8, showTimebar: false},
    {question: "sdfg", answer: "dfhg", displayTime: 0, id: 9, showTimebar: false}
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
        let nId = 0;
        const cardArray = action.payload;
        let nList = state.cardlist;

        for(let i = 0; i<state.cardlist.length; i++) {
          if(nId<state.cardlist[i].id) {
            nId = (state.cardlist[i].id)
          }
        }

        for (let i = 0; i < cardArray.length; i++) {
          const card = {...cardArray[i], showTimebar:cardArray[i].showTimebar , id:nId+1};
          nId = nId+1;
          nList.push(card);
        }
        console.log(nId);
          return { ...state, cardlist:nList, lastId: nId}
      
      case 'UPDATE_CARD':
        const updatedCards = action.payload.cardArray;
        const updatedIdArray = action.payload.cardIds;
        let updatedCardlist = state.cardlist;
        let lastId = state.lastId;
        for (let i = 0; i < updatedCardlist.length; i++) {
          for (let a = 0; a < updatedCards.length; a++) {
            if(updatedCardlist[i].id === updatedCards[a].id){
              updatedCardlist[i] = updatedCards[a];
            }
            if(updatedIdArray[a] > lastId){
              updatedCardlist.push({...updatedCards[a], id: updatedIdArray[a]});
              lastId = lastId + 1;
            }
          }
        }
        console.log(updatedCardlist)
      return {...state, cardlist: updatedCardlist, lastId}
      
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
      default:
        return state;
    }
  };
  