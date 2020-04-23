import React from "react";
import "./App.scss";
import { App, View } from "framework7-react";
import axios from "axios";
import config from "./config.json";
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import ChatPage from "./pages/chat/chat";
import Sidebar from "./components/sidebar/sidebar";
import { connect } from "react-redux";
import "./e2ee";

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
			path: "/chat/",
			on,
			component: ChatPage,
		},
		{
			path: "/login",
			component: LoginPage,
		},
	],
	touch: {
		tapHold: true,
	},
	theme: "ios",
	name: "GYKI Video",
	id: "com.gyki.video",
};

class WebApp extends React.Component {
	constructor(props) {
		super(props);
		this.init();
	}

	async componentDidMount() {
		window.$f7 = this.$f7;
		window.app = this.$f7;
	}

	async init() {
		axios.defaults.baseURL = config.api;
		var token = localStorage.getItem("token");
		if (!token) return this.props.logout();
		// this.props.login({});

		axios.defaults.headers.common["Authorization"] = token;
		var user = (await axios.get("/user")).data;
		if (!user.success) {
			this.props.logout();
		} else {
			this.props.login(user);
		}
		this.forceUpdate();
	}

	render() {
		return (
			<App params={f7params}>
				<Sidebar></Sidebar>
				<View preloadPreviousPage reloadPages main loadInitialPage pushState pushStateSeparator=""></View>
			</App>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			login: (user) => dispatch({ type: "LOGIN", payload: user }),
			logout: () => dispatch({ type: "LOGOUT" }),
		};
	}
)(WebApp);
