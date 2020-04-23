import axios from "axios";

export function user(state = { id: "", loggedin: false, username: "", role: "" }, action) {
	switch (action.type) {
		case "LOGIN":
			return { ...action.payload, loggedin: true };
		case "LOGOUT":
			var token = localStorage.removeItem("token");
			axios.defaults.headers.common["Authorization"] = "";
			return { loggedin: false };
		default:
			return state;
	}
}
