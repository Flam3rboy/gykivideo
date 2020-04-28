import React from "react";
import { Page, Navbar, Link, NavLeft, Icon, NavTitle } from "framework7-react";
import "./team.scss";
import { connect } from "react-redux";

class TeamPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};
	}

	componentDidMount() {}

	render() {
		return (
			<Page name="team" className="teamPage">
				<Navbar>
					<NavLeft>
						<Link color="black" panelOpen="left">
							<Icon f7="line_horizontal_3" />
						</Link>
					</NavLeft>
					<NavTitle large titleLarge="Chats">
						Teams
					</NavTitle>
				</Navbar>
				teams
			</Page>
		);
	}
}

export default connect(
	(s) => ({ user: s.user }),
	(dispatch) => {
		return {};
	}
)(TeamPage);
