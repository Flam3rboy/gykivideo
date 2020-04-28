import "./sidebar.scss";
import React from "react";
import { View, Page, Navbar, Panel, Icon, List, ListItem, Link, NavTitle, NavLeft } from "framework7-react";
import { connect } from "react-redux";
import ChatsSidebar from "../../pages/chat/chats";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.$f7 && this.$f7.panel) {
			var s = this.$f7.panel.get(".sidebar");
			if (s) {
				if (this.props.user.loggedin) {
					s.params.visibleBreakpoint = 1024;
					s.enableVisibleBreakpoint();
				} else {
					s.params.visibleBreakpoint = 100000;
					s.disableVisibleBreakpoint();
				}
			}
		}

		var route = this.props.location.pathname;

		return (
			<Panel
				visibleBreakpoint={this.props.user.loggedin ? 1024 : 10000}
				left
				swipe
				swipeActiveArea={40}
				reveal
				className="sidebar"
			>
				<Page>
					<div className="multiPanel">
						<List className="menuList">
							<ListItem
								noChevron
								panelClose
								href="/"
								// title="Startseite"
							>
								<Icon slot="media" f7="house"></Icon>
							</ListItem>

							<ListItem
								noChevron
								href="/chat/"
								// title="Direktnachrichten"
							>
								<Icon slot="media" f7="chat_bubble_2_fill"></Icon>
							</ListItem>
							<ListItem
								noChevron
								href="/team/"
								// title="Teams/Klassen"
							>
								<Icon slot="media" f7="person_3_fill"></Icon>
							</ListItem>
							<ListItem
								noChevron
								panelClose
								href="/settings"
								className="settings"
								// title="Einstellungen"
							>
								<Icon slot="media" f7="​​gear_alt_fill"></Icon>
							</ListItem>
						</List>
						<div className="panel-chat">
							{(() => {
								if (route.includes("/chat/")) {
									return <ChatsSidebar></ChatsSidebar>;
								}
							})()}
						</div>
					</div>
				</Page>
			</Panel>
		);
	}
}

export default connect((s) => s)(Sidebar);
