import React, { Component, Fragment } from "react";
import { Page, Navbar, NavTitle, Link, Icon, NavLeft, BlockTitle } from "framework7-react";
import { connect } from "react-redux";
import "./settings.scss";

class SettingsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Page name="chat" className="chatSelect">
				<Navbar>
					<NavLeft>
						<Link color="black" panelOpen="left">
							<Icon f7="line_horizontal_3" />
						</Link>
					</NavLeft>
					<NavTitle large titleLarge="Chats">
						Einstellungen
					</NavTitle>
				</Navbar>
			</Page>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {};
	}
)(SettingsPage);
