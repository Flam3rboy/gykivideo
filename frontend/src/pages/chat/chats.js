import React, { Fragment } from "react";
import { Link, Icon, List, ListItem, Searchbar, Button, Popup, Page, NavRight, Navbar } from "framework7-react";
import { connect } from "react-redux";
import "./chats.scss";
import renderAvater from "../../components/user/renderAvatar";
import axios from "axios";

class ChatsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			panelMarginLeft: null,
			search: "",
		};
		window.state.dispatch("ADD_DM", {
			recipients: ["5eab01d805223e2721f21586"],
			messages: [{ author: "5eab012605223e2721f21585", content: "test", read: true, timestamp: Date.now }],
			name: String,
		});
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

	setSearch = (e) => {
		var el = e.currentTarget;
		if (!el) return;

		this.setState({ search: el.value });
	};

	render() {
		var users = this.state.users;
		var dms = this.props.dms;

		return (
			<div className="chatSelectionSidebar">
				<Searchbar
					onChange={this.setSearch}
					className="search"
					searchContainer=".chatListSidebar"
					searchIn=".selectChat, .item-title, .item-text, .item-subtitle"
					disableButton={!this.$theme.aurora}
				>
					<Link popupOpen=".popup-addChat">
						<Icon className="addChat" f7="square_pencil"></Icon>
					</Link>
				</Searchbar>
				{/* <List className="search" inset style={{ margin: 0 }}>
					<ListInput type="text" placeholder="Suchen oder hinzufügen" clearButton />
				</List> */}
				<List className="searchbar-not-found">
					<ListItem title="Keine Person mit dem Namen gefunden" />
					<ListItem
						className="text-color-primary"
						noChevron
						href="#"
						popupOpen=".popup-addChat"
						title="Neuer Chat"
					>
						<Icon slot="media" f7="square_pencil"></Icon>
					</ListItem>
				</List>
				<List mediaList className="chatListSidebar">
					{dms.map((dm) => {
						var recipient = dm.recipients[0];

						var after = dm.messages ? "" + dm.messages[0].timestamp : "";

						return (
							<ListItem
								panelClose
								after={after}
								href={"/chat/" + dm.id}
								noChevron
								title={recipient.username}
								subtitle="Test"
								className="selectChat"
							>
								{renderAvater(recipient)}
							</ListItem>
						);
					})}
				</List>

				<Popup className="popup-addChat" swipeToClose>
					<Page>
						<Navbar title="Swipe To Close">
							<Searchbar
								onInput={this.search}
								value={this.state.search}
								clearButton={false}
								customSearch={true}
							></Searchbar>
							<NavRight>
								<Link popupClose>Close</Link>
							</NavRight>
						</Navbar>
						<List mediaList className="users">
							{typeof users === "object"
								? users.map((user) => {
										return (
											<li
												key={user.id}
												onClick={this.newChat}
												userid={user.id}
												className="media-item no-chevron userid"
											>
												<a className="item-link" href="#">
													<div className="item-content">
														<div className="item-media">{renderAvater(user)}</div>
														<div className="item-inner">
															<div className="item-title-row">
																<div className="item-title">{user.username}</div>
															</div>
														</div>
													</div>
												</a>
											</li>
										);
								  })
								: users}
						</List>
					</Page>
				</Popup>
			</div>
		);
	}

	newChat = (e) => {
		var el = e.currentTarget;
		if (!el) return;
		console.log(el, el.getAttribute("userid"));
	};

	search = async (e) => {
		this.setSearch(e);

		var el = e.currentTarget;
		var search = el.value;
		try {
			if (!search) throw new Error("Kein Nutzer gefunden");
			var { data } = await axios.post("/search/users", { name: search });
			if (!data.success) throw new Error(data.error || "Keine Nutzer gefunden");
			this.setState({ users: data.users });
		} catch (error) {
			this.setSearch({ users: error });
		}
	};
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {};
	}
)(ChatsPage);
