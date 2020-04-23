import "./sidebar.scss";
import React from "react";
import { View, Page, Navbar, Panel, Icon, List, ListItem, Link } from "framework7-react";
import { connect } from "react-redux";

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
					s.params.visibleBreakpoint = 102400;
					s.disableVisibleBreakpoint();
				}
			}
		}

		return (
			<Panel
				visibleBreakpoint={this.props.user.loggedin ? 1024 : 10000}
				left
				swipe
				swipeActiveArea={40}
				cover
				resizable
				className="sidebar"
			>
				<Page>
					<Navbar title="Videokonferenz"></Navbar>
					<Link href="/chat/">test</Link>
					<List>
						<ListItem href="/" title="Startseite">
							<Icon slot="media" f7="house"></Icon>
						</ListItem>
						<ListItem href="/chat/" title="Direktnachrichten">
							<Icon slot="media" f7="chat_bubble_2_fill"></Icon>
						</ListItem>
						<ListItem href="" title="Teams/Klassen">
							<Icon slot="media" f7="person_3_fill"></Icon>
						</ListItem>
						<ListItem href="" title="Einstellungen">
							<Icon slot="media" f7="​​gear_alt_fill"></Icon>
						</ListItem>
					</List>
				</Page>
			</Panel>
		);
	}
}

export default connect((s) => s)(Sidebar);
