import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, Panel, Block, Col, Button } from "framework7-react";
import { connect } from "react-redux";

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidUpdate() {
		if (!this.props.user.loggedin) {
			this.$f7router.navigate("/login/", { animate: false, pushState: true });
		}
	}

	render() {
		return (
			<Page name="home">
				<Navbar title="Home Page"/>
				<Block>Left panel content</Block>
				<Block className="row">
					<Col>
						<Button onClick={this.props.sidebarOpen} raised >Open left panel</Button>
					</Col>
				</Block>
			</Page>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			sidebarClose: () => dispatch({ type: "SIDEBAR_CLOSE" }),
			sidebarOpen: () => dispatch({ type: "SIDEBAR_OPEN" }),
		};
	}
)(HomePage);
