import "./sidebar.scss";
import React from "react";
import { View, Page, Navbar, Panel, Icon, List, ListItem } from "framework7-react";
import { connect } from "react-redux";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Panel
				// onPanelOpened={this.props.open}
				onPanelClosed={this.props.close}
				opened={this.props.sidebar.open}
				visibleBreakpoint={1024}
				left
				cover
				resizable
				className="sidebar show-desktop"
			>
				<View className="view-left">
					<Page>
						<Navbar title="Videokonferenz"></Navbar>
						<List>
							<ListItem link="/" title="Startseite">
								<Icon slot="media" f7="house"></Icon>
							</ListItem>
							<ListItem link="/" title="Direktnachrichten">
								<Icon slot="media" f7="chat_bubble_2_fill"></Icon>
							</ListItem>
							<ListItem link="/" title="Teams/Klassen">
								<Icon slot="media" f7="person_3_fill"></Icon>
							</ListItem>
							<ListItem link="/" title="Einstellungen">
								<Icon slot="media" f7="​​gear_alt_fill"></Icon>
							</ListItem>
						</List>
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
