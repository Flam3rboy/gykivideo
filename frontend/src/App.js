import React from "react";
import "./App.scss";
import { App, View } from "framework7-react";
import axios from "axios";
import config from "./config.json";
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import Sidebar from "./components/sidebar/sidebar";
import { connect } from "react-redux";

const f7params = {
	// Array with app routes
	routes: [
		{
			path: "/login",
			component: LoginPage,
		},
		{
			path: "/",
			component: HomePage,
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
	}

	async componentWillMount() {
		await this.init();
	}

	async init() {
		axios.defaults.baseURL = config.api;
		var token = localStorage.getItem("token");
		if (!token) return this.props.logout();
		axios.defaults.headers.common["Authorization"] = token;
		var user = (await axios.get("/user")).data;
		if (!user.success) this.props.logout();
		else this.props.login(user);
	}

	render() {
		return (
			<App params={f7params}>
				<Sidebar></Sidebar>
				<View preloadPreviousPage reloadPages main loadInitialPage pushState pushStateSeparator="" />
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
