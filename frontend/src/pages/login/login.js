import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, List, ListInput, Icon, Range } from "framework7-react";
import "./login.scss"

export default () => (
	<Page name="login">
		<Navbar title="Login" />
		<List inlineLabels noHairlinesMd>
			<ListInput
				label="Name"
				type="text"
				placeholder="Your name"
				clearButton
			>
				<Icon icon="demo-list-icon" slot="media" />
			</ListInput>
			<ListInput
				label="Password"
				type="password"
				placeholder="Your password"
				clearButton
			>
				<Icon icon="demo-list-icon" slot="media" />
			</ListInput>
		</List>
	</Page>
);
