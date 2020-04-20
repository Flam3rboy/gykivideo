import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import HomePage from "./pages/home/";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";

const f7params = {
	// Array with app routes
	routes: [
		{
			path: "/",
			component: HomePage,
		},
	],
	name: "GYKI Video",
	id: "com.gyki.video",
};

class WebApp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<App params={f7params}>
				<View main url="/" />
			</App>
		);
	}
}

export default WebApp;
