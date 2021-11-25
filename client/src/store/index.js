import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_CURRENT_LIST_ITEM_EDITED: "SET_CURRENT_LIST_ITEM_EDITED",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
    ON_YOUR_LISTS: "ON_YOUR_LISTS",
    ON_ALL_LISTS: "ON_ALL_LISTS",
    ON_USER_LISTS: "ON_USER_LISTS",
    ON_COMMUNITY_LISTS: "ON_COMMUNITY_LISTS",
    NEW_LIST_CARD: "NEW_LIST_CARD"

}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

let localOnYourLists = true;
let localOnAllLists = false;
let localOnUserLists = false;
let localOnCommunityLists = false;
let localSearchText = "";
let localListCardId = null;

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        isListNameEditActive: false,
        errorMessage: null,
        listOpen: false,
        onYourListsPage: true,
        onAllListsPage: false,
        onUserListsPage: false,
        onCommunityListsPage: false,
        listHasBeenEdited: false,
        listcardExpanded:null
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    if(auth != null && auth.user!= null && auth.user.userName=== "Guest"){
        localOnYourLists = false;
        localOnAllLists = true;
    }

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    listHasBeenEdited:false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: true,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    listHasBeenEdited:false,
                    onYourListsPage: localOnYourLists,
                    onUserListsPage: localOnUserLists,
                    onAllListsPage: localOnAllLists,
                    onCommunityListsPage: localOnCommunityLists,
                    listcardExpanded: localListCardId
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    errorMessage: null,
                    listOpen: false,
                    listHasBeenEdited:false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    listHasBeenEdited:false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: true,
                    listHasBeenEdited:false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: localListCardId
                });
            }
            // UPDATE A LIST AND THE LIST HAS BEEN EDITED
            case GlobalStoreActionType.SET_CURRENT_LIST_ITEM_EDITED: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: true,
                    listHasBeenEdited:true,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: store.listOpen,
                    listHasBeenEdited:store.listHasBeenEdited,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            case GlobalStoreActionType.SET_ERROR_MESSAGE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: payload,
                    listOpen: store.listOpen,
                    listHasBeenEdited:false,
                    onYourListsPage: store.onYourListsPage,
                    onUserListsPage: store.onUserListsPage,
                    onAllListsPage: store.onAllListsPage,
                    onCommunityListsPage: store.onCommunityListsPage,
                    listcardExpanded: null
                });
            }
            //NOW FOR SWITCHING BETWEEN THE VARIOUS LISTS TYPES WE HAVE:
            case GlobalStoreActionType.ON_YOUR_LISTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: true,
                    onAllListsPage: false,
                    onUserListsPage: false,
                    onCommunityListsPage: false,
                    listHasBeenEdited:false,
                    listcardExpanded: null
                });
            }
            case GlobalStoreActionType.ON_ALL_LISTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: false,
                    onAllListsPage: true,
                    onUserListsPage: false,
                    onCommunityListsPage: false,
                    listHasBeenEdited:false,
                    listcardExpanded: null
                });
            }
            case GlobalStoreActionType.ON_USER_LISTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: false,
                    onAllListsPage: false,
                    onUserListsPage: true,
                    onCommunityListsPage: false,
                    listHasBeenEdited:false,
                    listcardExpanded: null
                });
            }
            case GlobalStoreActionType.ON_COMMUNITY_LISTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: false,
                    onAllListsPage: false,
                    onUserListsPage: false,
                    onCommunityListsPage: true,
                    listHasBeenEdited:false,
                    listcardExpanded: null
                });
            }
            case GlobalStoreActionType.NEW_LIST_CARD: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    errorMessage: null,
                    listOpen: false,
                    onYourListsPage: false,
                    onAllListsPage: false,
                    onUserListsPage: false,
                    onCommunityListsPage: false,
                    listHasBeenEdited:false,
                    listcardExpanded: payload
                });
            }
            
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(top5List.name === newName){
                return;
            }
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let newArray = [];
                            for(let i = 0; i < pairsArray.length; i ++){
                                let newResponse = await api.getTop5ListById(pairsArray[i]._id);
                                console.log(newResponse);
                                if(newResponse.data.success){
                                    let top5List = newResponse.data.top5List;
                                    if(top5List.ownerEmail === auth.user.email){
                                        console.log("Emails are equivalent, ", top5List.ownerEmail);
                                        newArray.push(pairsArray[i]);
                                        //console.log("Invalid email detected! Aborting accessing.");
                                        //return;
                                    }
                                }
                            }
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: newArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }

            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        localListCardId = null;
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        console.log("Clearing all transactions");
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let minId = 0;
        for(let i = 0; i < store.idNamePairs.length; i++){
            if (store.idNamePairs[i].name.includes("Untitled List ")){
                minId = parseInt(store.idNamePairs[i].name.substring("Untitled List ".length))
                if(minId >= store.newListCounter){
                    store.newListCounter = minId + 1;
                }
            }
        }
        let newListName = "Untitled List " + store.newListCounter;
        console.log("Creating a new list, user Name: ", auth.user);
        let payload = {
            name: newListName,
            items: ["", "", "", "", ""],
            ownerEmail: auth.user.email,
            published: "false",
            userName: auth.user.userName,
            comments: [],
            likedBy: [],
            dislikedBy:[],
            views:'0'
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        tps.clearAllTransactions();
        const response = await api.getTop5ListPairs();
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
            console.log("New id name pairs after loading:", pairsArray);
            let newArray = await store.loadInitialLists(pairsArray);
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: newArray
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    //This is for sorting the lists by whatever we want
    store.loadCustomIDNamePairs = async function (newArray) {
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: newArray
        });
    }




    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairsAfterPushingComment = async function () {
        await store.updateCurrentList();
        tps.clearAllTransactions();
        const response = await api.getTop5ListPairs();
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
            console.log("New id name pairs after loading:", pairsArray);
            let newArray = await store.loadInitialLists(pairsArray);
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: newArray
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.updateListViewsById = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success){
            let top5List = response.data.top5List;
            top5List.views = parseInt(top5List.views);
            top5List.views +=1;
            //await store.updateCurrentList();
            response = await api.updateTop5ListById(id, top5List);
            if(response.data.success){
                response = await api.getTop5ListPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    console.log("New id name pairs after loading:", pairsArray);
                    let newArray = await store.loadInitialLists(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: newArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
        }
    }

    //For sorting the initial lists by what page we're on
    store.loadInitialLists = async function(pairsArray){
        let newArray = [];
        if(localOnYourLists){
            for(let i = 0; i < pairsArray.length; i ++){
                let newResponse = await api.getTop5ListById(pairsArray[i]._id);
                if(newResponse.data.success){
                    let top5List = newResponse.data.top5List;
                    if(top5List.ownerEmail === auth.user.email && store.startsWith(top5List.name)){
                        console.log("Emails are equivalent, ", top5List.ownerEmail);
                        newArray.push(pairsArray[i]);
                    }
                }
            }
        }
        else if(localOnAllLists){
            for(let i = 0; i < pairsArray.length; i ++){
                let newResponse = await api.getTop5ListById(pairsArray[i]._id);
                if(newResponse.data.success){
                    let top5List = newResponse.data.top5List;
                    if(top5List.published !== "false" && store.startsWith(top5List.name)){
                        newArray.push(pairsArray[i]);
                    }
                }
            }
        }
        else if(localOnUserLists){
            for(let i = 0; i < pairsArray.length; i ++){
                let newResponse = await api.getTop5ListById(pairsArray[i]._id);
                if(newResponse.data.success){
                    let top5List = newResponse.data.top5List;
                    if(top5List.published !== "false" && store.matchesExactly(top5List.userName)){
                        newArray.push(pairsArray[i]);
                    }
                }
            }
        }
        else if(localOnCommunityLists){

        }
        return newArray;

    }
    store.startsWith = function(text){
        let localSearchTextLowercase = localSearchText.toLowerCase();
        text = text.toLowerCase();
        console.log("localSearchText: ", localSearchTextLowercase);
        console.log("text: ", text);
        for(let i = 0; i < localSearchTextLowercase.length; i ++){
            if(localSearchTextLowercase[i] !== text[i]){
                return false;
            }
        }
        return true;
    }

    store.matchesExactly = function(text){
        let localSearchTextLowercase = localSearchText.toLowerCase();
        text = text.toLowerCase();
        if(text !== localSearchTextLowercase){
            return false;
        }
        return true;
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(top5List.ownerEmail !== auth.user.email){
                console.log("Invalid email detected! Aborting accessing.", top5List.ownerEmail, auth.user.email);
                return;
            }
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
            console.log("Current list before opening the delete modal: ", store.currentList);
            // let modal = document.getElementById("delete-modal");
            // modal.classList.add("is-visible");
        }
    }
    //HIDES THE DELETE MODAL
    store.hideDeleteListModal = function () {
        async function asyncHideDeleteListModal() {
            console.log("Marking list for deletion...");
            storeReducer({
                type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
                payload: null
            });
        }
        asyncHideDeleteListModal();
        // let modal = document.getElementById("delete-modal");
        // modal.classList.remove("is-visible");
    }

    store.deleteList = async function (listToDelete) {
        let tempResponse = await api.getTop5ListById(listToDelete._id);
        let top5List = tempResponse.data.top5List;
        if(top5List.ownerEmail !== auth.user.email){
            console.log("Invalid email detected! Aborting accessing.", top5List.ownerEmail, auth.user.email);
            return;
        }
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(top5List.ownerEmail !== auth.user.email){
                console.log("Invalid email detected! Aborting accessing.", top5List.ownerEmail, auth.user.email);
                return;
            }
            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }


    store.setCurrentListWithoutChangingPage = async function (id) {
        localListCardId = id;
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            // top5List.views = parseInt(top5List.views);
            // //Increment the view count by 1...
            // top5List.views += 1;
            //response = await api.updateTop5ListById(top5List._id, top5List);
            //store.currentList = top5List;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: top5List
            });
            //store.updateCurrentList();
            console.log("We set the current list without changing the page!");
            // if (response.data.success) {
            //     storeReducer({
            //         type: GlobalStoreActionType.SET_CURRENT_LIST,
            //         payload: top5List
            //     });
            // }
        }
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    //UPDATE THE ITEM WE'RE EDITING
    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateListsWithoutSaving();
    }
    //Useful for updating our top5Items without them hitting the save button
    store.updateListsWithoutSaving = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST_ITEM_EDITED,
            payload: store.currentList
        });
    }

    //actually saves the items.
    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            store.listHasBeenEdited = false;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    //actually saves the items.
    store.updateListLikesAndDislikes = async function (id, likedBy, dislikedBy) {
        let response = await api.getTop5ListById(id);
        if (response.data.success){
            let top5List = response.data.top5List;
            top5List.likedBy = likedBy;
            top5List.dislikedBy = dislikedBy;
            response = await api.updateTop5ListById(id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
    }


    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }
    //SET THE ERROR MESSAGE SO WE CAN DISPLAY THE ALERT MODAL
    store.setErrorMessage = function (errorMsg) {
        storeReducer({
            type: GlobalStoreActionType.SET_ERROR_MESSAGE,
            payload: errorMsg
        });
    }
    //FOR SETTING WHAT VIEW WE'RE IN
    store.setYourListsView = function(){
        localOnYourLists = true;
        localOnAllLists = false;
        localOnUserLists = false;
        localOnCommunityLists = false;
        localListCardId = null;
        store.loadIdNamePairs();
    }

    store.setAllListsView = function(){
        localOnYourLists = false;
        localOnAllLists = true;
        localOnUserLists = false;
        localOnCommunityLists = false;
        localListCardId = null;
        store.loadIdNamePairs();
    }

    store.setUserListsView = function(){
        localOnYourLists = false;
        localOnAllLists = false;
        localOnUserLists = true;
        localOnCommunityLists = false;
        localListCardId = null;
        store.loadIdNamePairs();
    }

    store.setCommunityListsView = function(){
        localOnYourLists = false;
        localOnAllLists = false;
        localOnUserLists = false;
        localOnCommunityLists = true;
        localListCardId = null;
        store.loadIdNamePairs();
    }

    store.setLocalSearchText = function(text){
        localSearchText = text;
        store.loadIdNamePairs();
    }
    store.getLocalSearchText = function(){
        return localSearchText;
    }
    store.setListCardExpanded = function(newListCardId){
        storeReducer({
            type: GlobalStoreActionType.NEW_LIST_CARD,
            payload:newListCardId
        });
    }

    store.resetLocalSearchtext = function(){
        localSearchText = "";
    }

    store.resetLocalListCardId = function(){
        localListCardId = null;
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };