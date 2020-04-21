import React from "react";
import {
	App,
	View,
	Page,
	Navbar,
	Toolbar,
	Link,
	Panel,
	Block,
	Button,
	Icon,
	NavLeft,
	NavTitle,
	Card,
	CardHeader,
	CardContent,
	List,
	ListItem
} from "framework7-react";
import { connect } from "react-redux";
import {Col, Row} from"react-bootstrap"
import {CardBody} from "react-bootstrap/Card";

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
				<Navbar>
					<NavLeft>
						<Link color="black" onClick={this.props.sidebarOpen}>
							<Icon f7="line_horizontal_3"/>
						</Link>
					</NavLeft>
					<NavTitle>Home Page</NavTitle>
				</Navbar>
				<Block className="row">
					<Col>

						<Card className={"col-md-6"}>
							<CardHeader>Letzten Nachrichten</CardHeader>
							<CardContent>
								<List simple-list>
									<ListItem title="John:" after="Hallo Samuel"></ListItem>
									<ListItem title="Stefan:" after="Programmieren!"></ListItem>
									<ListItem title="Frau Müller:" after="Hallo Samuel <3"></ListItem>
								</List>
							</CardContent>
						</Card>
					</Col>
					<Col>

						<Card className={"col-md-6"}>
							<CardHeader>Termine</CardHeader>
							<CardContent>
								<List simple-list>
									<ListItem title="Item 1"></ListItem>
									<ListItem title="Item 2"></ListItem>
									<ListItem title="Item 3"></ListItem>
								</List>
							</CardContent>
						</Card>
					</Col>
					<Col>

						<Card className={"col-md-6"}>
							<CardHeader>Stundenplan</CardHeader>
							<CardContent>

							</CardContent>
						</Card>
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
