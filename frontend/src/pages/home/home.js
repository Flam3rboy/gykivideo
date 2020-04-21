import React from "react";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var loggedIn = false;
		if (!loggedIn) {
			this.$f7router.navigate("/login/", { animate: false, pushState: true });
		}
		return (
			<Page name="home">
				<Navbar title="Home Page" />
				<Link back href="/about/">
					About Page
				</Link>
				<Link loginScreenOpen href="/login/">
					Login Page
				</Link>
			</Page>
		);
	}
}
