import {
    TOKEN_INIT
} from '../constants'

const initialState = {

}

export default (state = initialState, action) => {
    switch (action.type) {
        case TOKEN_INIT:{
            return {
                ...state,
                ...action.token
            }
        }
        default:
            return state
    }
}
