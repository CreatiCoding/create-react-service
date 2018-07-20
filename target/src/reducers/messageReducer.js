import * as types from "../actions/ActionTypes";

const initialState = {
	message: "Hello World!"
};

export default function messageReducer(state = initialState, action) {
	switch (action.type) {
		case types.CHANGE_MESSAGE:
			return {
				...state,
				message: action.message
			};
		default:
			return state;
	}
}
