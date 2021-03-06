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
	ListItem,
} from "framework7-react";
import { connect } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { CardBody } from "react-bootstrap/Card";

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Page name="home">
				<Navbar>
					<NavLeft>
						<Link color="black" panelOpen="left">
							<Icon f7="line_horizontal_3" />
						</Link>
					</NavLeft>
					<NavTitle>Home Page</NavTitle>
				</Navbar>
				<Block className="row">
					<Col xs="12" md="6" lg="4">
						<Card>
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
					<Col xs="12" md="6" lg="4">
						<Card>
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
					<Col xs="12" md="6" lg="4">
						<Card>
							<CardHeader>Stundenplan</CardHeader>
							<CardContent></CardContent>
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
		return {};
	}
)(HomePage);
