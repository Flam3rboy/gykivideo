import React, { Component, Fragment } from "react";
import { Page, Navbar, NavTitle, Link, Icon, NavLeft, BlockTitle } from "framework7-react";
import { connect } from "react-redux";
import imgEmptyDoc from "../../resources/emptyDoc.png";
import "./nochat.scss";

class NoChatPage extends Component {
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
						Chats
					</NavTitle>
				</Navbar>

				<div
					className="center"
					style={{
						display: "flex",
						flexDirection: "column",
						textAlign: "center",
						justifyContent: "center",
						marginTop: "1rem",
					}}
				>
					<BlockTitle large>Wähle einen Chat aus</BlockTitle>
					<div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "3rem" }}>
						<img src={imgEmptyDoc}></img>
					</div>
				</div>
			</Page>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {};
	}
)(NoChatPage);
