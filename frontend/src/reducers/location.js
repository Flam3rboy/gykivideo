import axios from "axios";

export function location(state = { pathname: "" }, action) {
	switch (action.type) {
		case "LOCATION":
			return { ...state, ...action.payload };
		default:
			return state;
	}
}
