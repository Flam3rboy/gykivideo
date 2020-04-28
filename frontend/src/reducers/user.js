import axios from "axios";

export function user(state = { id: "", loggedin: false, username: "", role: "" }, action) {
	switch (action.type) {
		case "LOGIN":
			return { ...action.payload, loggedin: true };
		case "LOGOUT":
			var token = localStorage.removeItem("token");
			axios.defaults.headers.common["Authorization"] = "";
			setTimeout(() => {
				try {
					window.app.view.main.router.navigate("/login/");
				} catch (error) {}
			}, 0);
			return { loggedin: false };
		default:
			return state;
	}
}
