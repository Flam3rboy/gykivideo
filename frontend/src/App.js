import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";
import axios from "axios";
import config from "./config.json";
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";

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
		this.init();
	}

	async init() {
		axios.defaults.baseURL = config.api;
		var token = localStorage.getItem("token");
		var loggedin = false;
		if (token) {
			axios.defaults.headers.common["Authorization"] = token;
			loggedin = (await axios.get("/user")).data;
			console.log(loggedin);
			loggedin = loggedin.success;
		}

		global.loggedin = loggedin;
	}

	render() {
		return (
			<App params={f7params}>
				<View main loadInitialPage pushState pushStateSeparator="" />
			</App>
		);
	}
}

export default WebApp;
