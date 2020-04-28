import React from "react";
import "./App.scss";
import { App, View, Panel, Page, Block } from "framework7-react";
import axios from "axios";
import config from "./config.json";
import SettingsPage from "./pages/settings/settings";
import TeamPage from "./pages/team/team";
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import ChatPage from "./pages/chat/chat";
import noSelectedChatPage from "./pages/chat/noChat";
import Sidebar from "./components/sidebar/sidebar";
import { connect } from "react-redux";
import E2EE from "./crypto/e2ee";

var on = {
	pageBeforeIn: (e, page) => {
		var state = global.store.getState();
		var { user } = state;

		console.log("loggedin:" + user.loggedin);

		if (!user.loggedin) {
			page.router.navigate("/login/");
		}
	},
};

const f7params = {
	// Array with app routes
	routes: [
		{
			path: "/",
			on,
			component: HomePage,
		},
		{
			path: "/chat/:id",
			on,
			component: ChatPage,
		},
		{
			path: "/chat/",
			on,
			component: noSelectedChatPage,
		},
		{
			path: "/team/",
			on,
			component: TeamPage,
		},
		{
			path: "/login",
			component: LoginPage,
		},
		{
			path: "/settings",
			component: SettingsPage,
		},
	],
	on: {
		routeChange: (route) => {
			global.store.dispatch({
				type: "LOCATION",
				payload: {
					pathname: route.path,
				},
			});
		},
	},
	touch: {
		tapHold: true,
	},
	photoBrowser: {
		type: "popup",
	},
	theme: "ios",
	name: "GYKI Video",
	id: "com.gyki.video",
};

class WebApp extends React.Component {
	constructor(props) {
		super(props);
		this.init();
		this.state = {
			interval: false,
			error: false,
		};
	}

	componentWillMount() {
		window.InitialPage = window.location.pathname;
	}

	async componentDidMount() {
		window.$f7 = this.$f7;
		window.app = this.$f7;
	}

	init = async () => {
		axios.defaults.baseURL = config.api;
		var token = localStorage.getItem("token");
		var privateKey = localStorage.getItem("privatekey");
		var publicKey = localStorage.getItem("publickey");
		if (!token || !privateKey || !publicKey) return this.props.logout();

		var e2ee = new E2EE();

		axios.defaults.headers.common["Authorization"] = token;
		global.axios = axios;
		try {
			var user = await axios.get("/user");
			if (user.status === 502) throw "Server sind offline";
			if (!user.data.success) {
				this.props.logout();
			} else if (user.data.success === true) {
				this.props.login({ ...user.data, privateKey, publicKey });
				this.setState({ error: false, interval: false });
			} else {
				throw "";
			}
		} catch (error) {
			if (error.message === "Network Error") {
				error = "Keine Internetverbindung";
			}
			if (!this.state.interval) {
				this.state.interval = 2;
			}
			this.setState({ interval: this.state.interval + 1, error: error });
			console.log(1000 * this.state.interval);

			setTimeout(this.init, 1000 * this.state.interval);
		}
	};

	render() {
		if (this.$f7) {
			this.$f7.dialog.close();
			if (this.state.error) {
				this.$f7.dialog.preloader(
					`Fehler beim einloggen:<br>${this.state.error}<br>In ${this.state.interval} sekunden erneut versuchen`
				);
			}
		}

		return (
			<App params={f7params}>
				<Sidebar></Sidebar>
				<View reloadPages main loadInitialPage pushState pushStateSeparator=""></View>
			</App>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			login: (user) => {
				dispatch({ type: "LOGIN", payload: user });
			},
			logout: (user) => dispatch({ type: "LOGOUT", payload: user }),
		};
	}
)(WebApp);
