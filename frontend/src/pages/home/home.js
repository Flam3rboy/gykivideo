import React from "react";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";

export default () => (
	<Page name="home">
		<Navbar title="Home Page" />
		<Link href="/about/">About Page</Link>
		<Link href="/login/">Login Page</Link>
	</Page>
);
