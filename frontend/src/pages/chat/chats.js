import React, { Fragment } from "react";
import { ListInput, Icon, List, ListItem, Searchbar } from "framework7-react";
import { connect } from "react-redux";
import "./chats.scss";
import mama from "./mama.jpg";
import raphie from "./raphi.jpeg";

class ChatsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			panelMarginLeft: null,
		};
	}

	componentDidMount = () => {
		window.addEventListener("resize", this.resize);
		this.resize();
	};

	componentWillUnmount = () => {
		window.removeEventListener("resize", this.resize);
	};

	resize = () => {
		var panel = this.refs.panel;

		if (panel) {
			this.setState({ panelMarginLeft: panel.f7Panel.el.offsetWidth });
		}
	};

	render() {
		return (
			<div className="chatSelectionSidebar">
				<Searchbar
					className="search"
					searchContainer=".chatListSidebar"
					searchIn=".selectChat, 	.item-title, .item-text, .item-subtitle"
					disableButton={!this.$theme.aurora}
				></Searchbar>
				{/* <List className="search" inset style={{ margin: 0 }}>
					<ListInput type="text" placeholder="Suchen oder hinzufügen" clearButton />
				</List> */}
				<List className="searchbar-not-found">
					<ListItem title="Nothing found" />
				</List>
				<List mediaList className="chatListSidebar">
					<ListItem
						panelClose
						after="17:14"
						href="/chat/test1"
						noChevron
						title="Raphael Scheit"
						subtitle="Test"
						className="selectChat"
					>
						<img slot="media" src={raphie} />
					</ListItem>
					<ListItem
						panelClose
						after="17:14"
						href="/chat/test2"
						noChevron
						title="Frank Scheit"
						subtitle="Queen"
						className="selectChat"
					>
						<Icon width="44" slot="media" f7="person_crop_circle"></Icon>
					</ListItem>
					<ListItem
						panelClose
						after="17:14"
						href="/chat/test3"
						noChevron
						title="Stephanie Scheit"
						subtitle="Michael Jackson"
						className="selectChat"
					>
						<img slot="media" src={mama} />
					</ListItem>
				</List>
			</div>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {};
	}
)(ChatsPage);
