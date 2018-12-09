import {
    createStore,
    applyMiddleware,
    compose
} from "redux";

import rootReducer from "../reducers";

import {
    createLogger
} from "redux-logger";

import thunkMiddleware from "redux-thunk";

import promiseMiddleware from "redux-promise-middleware";

const logger = createLogger();

const configureStore = (preloadedState = {}) => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(
                thunkMiddleware,
                promiseMiddleware(),
                logger
            )
        )
    )

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}


export default configureStore;
