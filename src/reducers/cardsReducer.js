
const initialState = {
    cardlist: [{question: "45-6", answer: "39", id: 1, displayTime: 3},
    {question: "5*5", answer: "25", id: 2, displayTime: 3},
    {question: "10*10", answer: "100", id: 3, displayTime: 3},
    {question: "1+1", answer: "2", displayTime: 0, id: 4},
    {question: "2+2", answer: "4", displayTime: 0, id: 5},
    {question: "4+4", answer: "8", displayTime: 0, id: 6},
    {
      question: 'sdfg',
      answer: 'sdfgggfd',
      displayTime: 0,
      id: 7
    },
    {
      question: 'fgf',
      answer: 'ghfvb',
      displayTime: 0,
      id: 8
    },
    {
      question: 'sdfg',
      answer: 'dfhg',
      displayTime: 0,
      id: 9
    }
  ],
    card: null,
    lastId:9,
    selectedEquation:null
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
          const card = {...cardArray[i], id:nId+1};
          nId = nId+1;
          nList.push(card);
        }
        console.log(nId);
          return { ...state, cardlist:nList, lastId: nId}
      
      case 'SET_SELECTED_EQUATION':
        const selectedEquation = action.payload;
        return {...state, selectedEquation}
      default:
        return state;
    }
  };
  