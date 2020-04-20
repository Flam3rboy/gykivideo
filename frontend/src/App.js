import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import LoginPage from "./pages/login/login";
import HomePage from "./pages/home/home";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";

const f7params = {
	// Array with app routes
	routes: [
		{
			path: "/login",
			component: LoginPage
		},
		{
			path: "/",
			component: HomePage
		},
	],
	theme: "ios",
	name: "GYKI Video",
	id: "com.gyki.video"
};

class WebApp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<App params={f7params}>
				<View main url="/login" />
			</App>
		);
	}
}

export default WebApp;
