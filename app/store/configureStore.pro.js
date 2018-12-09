import {
    createStore,
    applyMiddleware,
} from "redux";

import rootReducer from "../reducers";


import thunkMiddleware from "redux-thunk";

import promiseMiddleware from "redux-promise-middleware";

const configureStore = (preloadedState = {}) => {
    const stroe = createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            promiseMiddleware()
        )
    );
    return stroe
};

export default configureStore;