import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, Panel, Block, Col, Button } from "framework7-react";
import { connect } from "react-redux";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	log(t) {
		console.log("log", t);
	}

	componentDidMount() {}

	render() {
		return (
			<Panel
				className="sidebar"
				onPanelOpened={this.props.open}
				onPanelClosed={this.props.close}
				opened={this.props.sidebar.open}
				left
				resizable
				themeDark
			>
				<View>
					<Page>
						<Block>Right panel content</Block>
					</Page>
				</View>
			</Panel>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			close: () => dispatch({ type: "SIDEBAR_CLOSE" }),
			open: () => dispatch({ type: "SIDEBAR_OPEN" }),
		};
	}
)(Sidebar);
