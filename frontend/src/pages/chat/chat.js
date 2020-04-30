import React, { Component, Fragment } from "react";
import {
	Page,
	Navbar,
	NavTitle,
	Messagebar,
	Link,
	Popover,
	List,
	ListItem,
	Icon,
	SwipeoutActions,
	SwipeoutButton,
	Actions,
	ActionsButton,
	ActionsGroup,
	ActionsLabel,
	NavLeft,
	MessagebarAttachment,
	MessagebarAttachments,
	Messages,
	MessagebarSheet,
	Message,
	MessagebarSheetImage,
	MessagesTitle,
} from "framework7-react";
import { connect } from "react-redux";
import "./chat.scss";

class ChatPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attachments: [],
			sheetVisible: false,
			reply: false,
			typingMessage: null,
			messagesData: [
				{
					id: 0,
					type: "sent",
					text: "Hi, Kate",
				},
				{
					id: 1,
					type: "sent",
					text: "How are you?",
				},
				{
					id: 2,
					name: "Kate",
					type: "received",
					text: "Hi, I am good!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					id: 3,
					name: "Blue Ninja",
					type: "received",
					text: "Hi there, I am also fine, thanks! And how are you?",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-7.jpg",
				},
				{
					id: 4,
					type: "sent",
					text: "Hey, Blue Ninja! Glad to see you ;)",
				},
				{
					id: 5,
					type: "sent",
					text: "Hey, look, cutest kitten ever!",
					read: true,
				},
				{
					id: 6,
					type: "sent",
					image: "https://cdn.framework7.io/placeholder/cats-200x260-4.jpg",
					read: true,
				},
				{
					id: 7,
					name: "Kate",
					type: "received",
					text: "Nice!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					id: 8,
					name: "Kate",
					type: "received",
					text: "Like it very much!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					id: 9,
					name: "Blue Ninja",
					type: "received",
					text: "Awesome!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-7.jpg",
				},
				{
					id: 10,
					type: "sent",
					text: "test read",
					read: true,
				},
				{
					id: 11,
					type: "sent",
					text: "test delivered",
					read: false,
				},
				{
					id: 12,
					type: "sent",
					text: "test pending",
					read: true,
					sending: true,
				},
			],
			images: [
				"https://cdn.framework7.io/placeholder/cats-300x300-1.jpg",
				"https://cdn.framework7.io/placeholder/cats-200x300-2.jpg",
				"https://cdn.framework7.io/placeholder/cats-400x300-3.jpg",
				"https://cdn.framework7.io/placeholder/cats-300x150-4.jpg",
				"https://cdn.framework7.io/placeholder/cats-150x300-5.jpg",
				"https://cdn.framework7.io/placeholder/cats-300x300-6.jpg",
				"https://cdn.framework7.io/placeholder/cats-300x300-7.jpg",
				"https://cdn.framework7.io/placeholder/cats-200x300-8.jpg",
				"https://cdn.framework7.io/placeholder/cats-400x300-9.jpg",
				"https://cdn.framework7.io/placeholder/cats-300x150-10.jpg",
			],
			people: [
				{
					name: "Kate Johnson",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					name: "Blue Ninja",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-7.jpg",
				},
			],
			answers: [
				"😂",
				"https://www.youtube.com/watch?v=WnFoNJvtFis",
				"Yes!",
				"No",
				"Hm...",
				"I am not sure",
				"And what about you?",
				"May be ;)",
				"Lorem ipsum dolor sit amet, consectetur",
				"What?",
				"Are you sure?",
				"Of course",
				"Need to think about it",
				"Amazing!!!",
			],
			responseInProgress: false,
		};
		console.log("chat init v.02");
	}

	render() {
		return (
			<Page name="chat" className="chat">
				<Navbar>
					<NavLeft>
						<Link color="black" panelOpen="left">
							<Icon f7="line_horizontal_3" />
						</Link>
					</NavLeft>
					<NavTitle large titleLarge="Chats">
						Chats
					</NavTitle>
				</Navbar>
				<Popover className="message-popup">
					<List>
						<ListItem onClick={this.reply} href="#" noChevron popoverClose title="Antworten">
							<Icon slot="media" f7="arrow_turn_up_left"></Icon>
						</ListItem>
						<ListItem onClick={this.copyMessage} href="#" noChevron popoverClose title="Kopieren">
							<Icon slot="media" f7="doc_on_doc_fill"></Icon>
						</ListItem>
						<ListItem
							href="#"
							noChevron
							onClick={() => this.refs.messageDelete.open()}
							popoverClose
							title="Löschen"
						>
							<Icon slot="media" f7="trash"></Icon>
						</ListItem>
					</List>
				</Popover>
				<Actions ref="messageDelete">
					<ActionsGroup>
						<ActionsLabel>Nachricht löschen</ActionsLabel>
						<ActionsButton color="red">Für alle löschen</ActionsButton>
						<ActionsButton color="red">Für mich löschen</ActionsButton>
						<ActionsButton>Cancel</ActionsButton>
					</ActionsGroup>
				</Actions>

				<Messagebar
					ref="test"
					placeholder={this.placeholder}
					ref={(el) => {
						this.messagebarComponent = el;
					}}
					attachmentsVisible={this.attachmentsVisible}
					sheetVisible={this.state.sheetVisible}
					onSubmit={this.sendMessage.bind(this)}
				>
					<Link
						iconIos="f7:camera_fill"
						iconAurora="f7:camera_fill"
						iconMd="material:camera_alt"
						slot="inner-start"
						onClick={() => {
							this.setState({ sheetVisible: !this.state.sheetVisible });
						}}
					></Link>
					<Link slot="inner-end" onClick={this.sendMessage.bind(this)}>
						<Icon ios="f7:paperplane_fill" aurora="f7:paperplane_fill" md="material:send"></Icon>
					</Link>
					<MessagebarAttachments>
						<div className="wrapper">
							<div className="reply messagebar-attachment">
								{this.state.reply
									? (() => {
											var message = this.state.reply;
											var author = message.name || "Du";
											var firstline = "Bild";
											if (message.text) {
												firstline = message.text.split("\n")[0];
											}
											return (
												<div>
													<h3>
														<strong>{author}</strong>
													</h3>
													{firstline}
												</div>
											);
									  })()
									: ""}
							</div>
							<div className="attachments">
								{this.state.attachments.map((image, index) => (
									<MessagebarAttachment
										key={index}
										image={image}
										onAttachmentDelete={() => this.deleteAttachment(image)}
									></MessagebarAttachment>
								))}
							</div>
						</div>
					</MessagebarAttachments>
					<MessagebarSheet>
						{this.state.images.map((image, index) => (
							<MessagebarSheetImage
								key={index}
								image={image}
								checked={this.state.attachments.indexOf(image) >= 0}
								onChange={this.handleAttachment.bind(this)}
							></MessagebarSheetImage>
						))}
					</MessagebarSheet>
				</Messagebar>

				<Messages
					scrollMessagesOnEdge
					ref={(el) => {
						this.messagesComponent = el;
					}}
				>
					<List>
						<MessagesTitle>
							<b>Sunday, Feb 9,</b> 12:58
						</MessagesTitle>
						{this.state.messagesData.map(this.renderMessage.bind(this))}
					</List>
					{this.state.typingMessage && (
						<Message
							type="received"
							typing={true}
							first={true}
							last={true}
							tail={true}
							header={`${this.state.typingMessage.name} is typing`}
							avatar={this.state.typingMessage.avatar}
						></Message>
					)}
				</Messages>
			</Page>
		);
	}

	renderMessage(message, index) {
		var { text } = message;

		var end = [];
		if (text) {
			var emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

			var textContainsOnlyEmoji = emoji_regex.test(text);

			var text = text.split("\n").map((part, ind) => {
				const linksFound = part.match(/(?:www|https?)[^\s]+/g);

				if (!linksFound) {
					if (ind < text.split("\n").length - 1)
						return (
							<Fragment>
								{" "}
								{part}
								<br />
							</Fragment>
						);
					return part;
				}

				var toReturn = linksFound.map((link, i) => {
					const aLink = [];
					let replace = linksFound[i];

					if (!linksFound[i].match(/(http(s?)):\/\//)) {
						replace = "http://" + linksFound[i];
					}
					let linkText = replace.split("/")[2];
					if (linkText.substring(0, 3) === "www") {
						linkText = linkText.replace("www.", "");
					}
					var youtube = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var match = replace.match(youtube);
					if (match && match[2].length === 11) {
						end.push(
							<iframe
								src={"https://www.youtube.com/embed/" + match[2]}
								frameBorder="0"
								allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						);
					} else if (linkText.match(/vimeo/)) {
						let vimeoID = replace.split("/").slice(-1)[0];
						end.push(
							<iframe
								src={"https://player.vimeo.com/video/" + vimeoID}
								frameBorder="0"
								webkitallowfullscreen
								mozallowfullscreen
								allowfullscreen
							></iframe>
						);
					} else {
						aLink.push(
							<a rel="noopener noreferrer" external href={replace} target="_blank">
								{replace}
							</a>
						);
						var first = part.split(link)[0];
						var last = part.split(link)[1];
						return (
							<span>
								{first}
								{aLink[i]}
								{last}
							</span>
						);
					}
				});
				console.log(ind, text.split("\n").length);

				if (ind < text.split("\n").length - 1) {
					toReturn.push(<br></br>);
				}

				if (!toReturn[0]) toReturn = null;
				return toReturn;
			});

			if (!text[0] || textContainsOnlyEmoji) text = null;

			if (textContainsOnlyEmoji) {
				end.push(<h1 key={end.length}>{message.text}</h1>);
			}
		}

		var readIcon = [];
		if (message.type === "sent") {
			if (message.sending) {
				readIcon.push(<Icon key="clock" className="check" f7="clock"></Icon>);
			} else {
				readIcon.push(<Icon key="checkmark" className="check" f7="checkmark_alt"></Icon>);
				if (message.read) {
					readIcon.push(<Icon key="doublecheckmark" className="check" f7="checkmark_alt"></Icon>);
				}
			}
		}

		return (
			<li className="swipeout" key={message.id}>
				<div className="swipeout-content">
					<div className="item-content">
						<div className="item-inner messageid" messageid={message.id}>
							<Message
								onClick={this.messageClick}
								type={message.type}
								image={message.image}
								name={message.name}
								avatar={message.avatar}
								first={this.isFirstMessage(message, index)}
								last={this.isLastMessage(message, index)}
								tail={this.isTailMessage(message, index)}
							>
								{text ? (
									<div slot="text">
										{text}
										{readIcon}
									</div>
								) : (
									""
								)}

								<div slot="content-end">
									{end}
									{text ? "" : readIcon}
								</div>
							</Message>
						</div>
					</div>
				</div>

				<SwipeoutActions right>
					<SwipeoutButton overswipe delete confirmText="Are you sure you want to delete this item?">
						<Icon f7="trash"></Icon>
					</SwipeoutButton>
				</SwipeoutActions>
				<SwipeoutActions left>
					<SwipeoutButton onClick={this.swipeout} overswipe color="green">
						<Icon f7="arrow_turn_up_left"></Icon>
					</SwipeoutButton>
				</SwipeoutActions>
			</li>
		);
	}

	copyMessage = (event) => {
		var messageEl = this.openPopup.parentElement;
		var messageId = parseInt(messageEl.getAttribute("messageid"));
		var msg = this.getMessage(messageId);
		console.log(msg, messageId, messageEl);

		if (msg.text) {
			copyToClipboard(msg.text);
		} else {
			SelectText(messageEl);
		}
	};

	messageClick = (e) => {
		var messageEl = e.currentTarget.parentElement;
		var messageId = parseInt(messageEl.getAttribute("messageid"));
		var msg = this.getMessage(messageId);
		console.log("photo browser", msg);
		if (msg.image) {
			var photoBrowser = this.$f7.photoBrowser
				.create({
					url: "",
					photos: [msg.image],
				})
				.open();
		}
	};

	swipeout = (e) => {
		var messageEl = e.currentTarget.parentElement.parentElement.querySelector(".messageid");
		var messageId = parseInt(messageEl.getAttribute("messageid"));

		this.$f7.swipeout.close(this.$f7.swipeout.el);
		this.setState({ reply: this.getMessage(messageId) });
	};

	reply = (e) => {
		var messageEl = this.openPopup.parentElement;
		var messageId = parseInt(messageEl.getAttribute("messageid"));
		var msg = this.getMessage(messageId);
		console.log({ messageEl, messageId, msg });

		this.setState({ reply: msg });
	};

	getMessage(id) {
		return this.state.messagesData.find((x) => x.id == id);
	}

	get attachmentsVisible() {
		const self = this;
		return !!(self.state.attachments.length > 0 || self.state.reply);
	}

	get placeholder() {
		const self = this;
		return self.attachmentsVisible ? "Add comment or Send" : "Message";
	}

	componentDidMount() {
		const self = this;
		this.$$(".message").on("taphold", this.contextMenuMessage);
		this.$$(".message").on("contextmenu", this.contextMenuMessage);
		this.$$(".swipeout").on("swipeoutDelete", this.swipeoutDelete);
		this.$$(".message").on("touchstart", this.doubleTapMessage, { passive: true });

		self.$f7ready(() => {
			self.messagebar = self.messagebarComponent.f7Messagebar;
			self.messages = self.messagesComponent.f7Messages;
			self.messagebar.$textareaEl[0].addEventListener("keypress", self.onKeyPress);
		});
	}

	componentDidUpdate = () => {
		this.$$(".message").off("touchstart", this.doubleTapMessage);
		this.$$(".message").off("contextmenu", this.contextMenuMessage);
		this.$$(".message").off("taphold", this.contextMenuMessage);
		this.$$(".swipeout").off("swipeoutDelete", this.swipeoutDelete);
		this.$$(".message").on("taphold", this.contextMenuMessage);
		this.$$(".message").on("contextmenu", this.contextMenuMessage);
		this.$$(".swipeout").on("swipeoutDelete", this.swipeoutDelete);
		this.$$(".message").on("touchstart", this.doubleTapMessage, { passive: true });
	};

	doubleTapMessage = (event) => {
		var timeDiff = new Date().getTime() - lastTapTime;
		console.log(timeDiff);

		if (timeDiff < 300) {
			console.log(event);
			this.contextMenuMessage(event);
		}
		lastTapTime = new Date().getTime();
		return true;
	};

	swipeoutDelete = (e) => {
		console.log("delete", e);
	};

	contextMenuMessage = (event) => {
		try {
			event.preventDefault();
		} catch (error) {}
		var popup = this.$f7.popover.get(".message-popup");
		if (popup) {
			var supportsVibrate = "vibrate" in navigator;
			if (supportsVibrate) navigator.vibrate(10);

			this.openPopup = event.currentTarget;
			popup.open(event.currentTarget, true);
		}
		return false;
	};

	componentWillUnmount() {
		this.messagebar.$textareaEl[0].removeEventListener("keypress", this.onKeyPress);
	}

	onKeyPress = (e) => {
		if (e.keyCode === 13 && this.$f7.device.desktop && !e.shiftKey) {
			e.preventDefault();
			this.sendMessage();
		}
	};

	isFirstMessage(message, index) {
		const self = this;
		const previousMessage = self.state.messagesData[index - 1];
		if (message.isTitle) return false;
		if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name)
			return true;
		return false;
	}

	isLastMessage(message, index) {
		const self = this;
		const nextMessage = self.state.messagesData[index + 1];
		if (message.isTitle) return false;
		if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
		return false;
	}

	isTailMessage(message, index) {
		const self = this;
		const nextMessage = self.state.messagesData[index + 1];
		if (message.isTitle) return false;
		if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
		return false;
	}

	deleteAttachment(image) {
		const self = this;
		const attachments = self.state.attachments;
		const index = attachments.indexOf(image);
		attachments.splice(index, 1);
		self.setState({ attachments });
	}

	handleAttachment(e) {
		const self = this;
		const attachments = self.state.attachments;
		const index = self.$$(e.target).parents("label.checkbox").index();
		const image = self.state.images[index];
		if (e.target.checked) {
			// Add to attachments
			attachments.unshift(image);
		} else {
			// Remove from attachments
			attachments.splice(attachments.indexOf(image), 1);
		}
		self.setState({ attachments });
	}

	sendMessage() {
		const self = this;
		const text = self.messagebar.getValue().trim();
		const messagesToSend = [];
		self.state.attachments.forEach((attachment) => {
			messagesToSend.push({
				image: attachment,
				id: Math.floor(Math.random() * 10000),
			});
		});
		if (text.trim().length) {
			messagesToSend.push({
				text,
				id: Math.floor(Math.random() * 10000),
			});
		}
		if (messagesToSend.length === 0) {
			return;
		}

		self.setState({
			// Reset attachments
			attachments: [],
			// reset reply
			reply: false,
			// Hide sheet
			sheetVisible: false,
			// Send message
			messagesData: [...self.state.messagesData, ...messagesToSend],
		});
		self.messagebar.clear();

		// Focus area
		if (text.length) self.messagebar.focus();

		// Mock response
		if (self.state.responseInProgress) return;
		self.setState({
			responseInProgress: true,
		});
		setTimeout(() => {
			const answer = self.state.answers[Math.floor(Math.random() * self.state.answers.length)];
			const person = self.state.people[Math.floor(Math.random() * self.state.people.length)];
			self.setState({
				typingMessage: {
					name: person.name,
					avatar: person.avatar,
				},
			});
			setTimeout(() => {
				self.setState({
					messagesData: [
						...self.state.messagesData,
						{
							id: Math.floor(Math.random() * 10000),

							text: answer,
							type: "received",
							name: person.name,
							avatar: person.avatar,
						},
					],
					typingMessage: null,
					responseInProgress: false,
				});
			}, 0);
		}, 0);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {};
	}
)(ChatPage);
// TODO
// apple-touch-startup-image
// PWA: https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native

var lastTapTime = 0;

function copyToClipboard(text) {
	if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand("copy"); // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn("Copy to clipboard failed.", ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}

function SelectText(element) {
	var doc = document;
	if (doc.body.createTextRange) {
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	try {
		var res = document.execCommand("copy"); // Security exception may be thrown by some browsers.
		selection.removeAllRanges();
		return res;
	} catch (ex) {
		console.warn("Copy to clipboard failed.", ex);
		return false;
	}
}
