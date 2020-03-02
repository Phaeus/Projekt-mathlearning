const initialState = {
    userlist: [
        {username:"h", password:"h", createdCollection:[], id:0}
    ],
    user:null,
    loginSuccess:false,
    usernameAvailable: false,
  };

export default(state = initialState, action) => {
    switch (action.type) {
        case "GET_USERLIST":
            return {...state, userlist: action.payload}

        case "GET_USER":
            const searchedUsername = action.payload;
            const user = state.userlist.find(user => user.username === searchedUsername);
            console.log(user)
            return {...state, user}

        case "CREATE_USER":
            let idNew = 0;
            for (let i = 0; i < state.userlist.length; i++) {
                if(idNew < state.userlist[i].id){
                    idNew = (state.userlist[i].id);
                }
            }
            console.log(action.payload)
            const newUser = {...action.payload, createdCollection:[], id:idNew+1};
            let newList = state.userlist;
            newList.push(newUser);
            return {...state, userlist:newList}

        case "CHECK_USER":
            const username = action.payload.username;
            const password = action.payload.password;
            console.log(state.userlist);
            for (let i = 0; i < state.userlist.length; i++) {
                if(username === state.userlist[i].username && password === state.userlist[i].password){
                    return {...state, loginSuccess:true}
                }
            }
            return {...state, loginSuccess:false}
        
        case "LOGIN_USER":
            const loggedInUsername = action.payload;
            const loggedInUser = state.userlist.find(user => user.username === loggedInUsername);
            return {...state, user:loggedInUser};
        
        case "GET_LOGIN_SUCCESS":
            return {...state, loginSuccess:state.loginSuccess}

        case "CHECK_AVAILABLE_USER":
            const potUsername = action.payload.username;
            for (let i = 0; i < state.userlist.length; i++) {
                if(potUsername === state.userlist[i].username){
                    return {...state, usernameAvailable:false}
                }
            }
            return {...state, usernameAvailable:true}

        case "ADD_PLAYED_COLLECTION":
            let userNew = {...state.user, playedCollection: action.payload};
            let userlistNew = state.userlist;
            for (let i = 0; i < userlistNew.length; i++) {
                if(userlistNew[i].id === userNew.id){
                    userlistNew[i] = userNew;
                }
            }
            return {...state, userlist: userlistNew}
        case "ADD_CREATED_COLLECTION":
            console.log(state.user)
            let createdCollection = state.user.createdCollection;
            let neUser = state.userlist.find(user => user.id === state.user.id);
            createdCollection.push(action.payload);
            neUser = {...neUser, createdCollection: createdCollection};
            let newUserlist = state.userlist;
            for (let i = 0; i < newUserlist.length; i++) {
                if(newUserlist[i].id === neUser.id){
                    newUserlist[i] = neUser;
                }
            }
            console.log("df",newUserlist)
            return {...state, userlist: newUserlist}
        default:
            return state;
    }
}