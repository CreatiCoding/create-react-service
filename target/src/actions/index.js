import * as types from "./ActionTypes";

export function changeMessage(message){
	return {
		type: types.CHANGE_MESSAGE,
		message
	};
}
