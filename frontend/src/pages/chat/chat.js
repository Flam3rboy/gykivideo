import React, { Component, Fragment } from "react";
import {
	Page,
	Navbar,
	NavTitle,
	Messagebar,
	Link,
	Icon,
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

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attachments: [],
			sheetVisible: false,
			typingMessage: null,
			messagesData: [
				{
					type: "sent",
					text: "Hi, Kate",
				},
				{
					type: "sent",
					text: "How are you?",
				},
				{
					name: "Kate",
					type: "received",
					text: "Hi, I am good!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					name: "Blue Ninja",
					type: "received",
					text: "Hi there, I am also fine, thanks! And how are you?",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-7.jpg",
				},
				{
					type: "sent",
					text: "Hey, Blue Ninja! Glad to see you ;)",
				},
				{
					type: "sent",
					text: "Hey, look, cutest kitten ever!",
				},
				{
					type: "sent",
					image: "https://cdn.framework7.io/placeholder/cats-200x260-4.jpg",
				},
				{
					name: "Kate",
					type: "received",
					text: "Nice!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					name: "Kate",
					type: "received",
					text: "Like it very much!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg",
				},
				{
					name: "Blue Ninja",
					type: "received",
					text: "Awesome!",
					avatar: "https://cdn.framework7.io/placeholder/people-100x100-7.jpg",
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
						{this.state.attachments.map((image, index) => (
							<MessagebarAttachment
								key={index}
								image={image}
								onAttachmentDelete={() => this.deleteAttachment(image)}
							></MessagebarAttachment>
						))}
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
					<MessagesTitle>
						<b>Sunday, Feb 9,</b> 12:58
					</MessagesTitle>

					{this.state.messagesData.map(this.renderMessage.bind(this))}
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
					return part;
				}

				var toReturn = linksFound.map((link, i) => {
					const aLink = [];
					let replace = linksFound[i];

					if (!linksFound[i].match(/(http(s?)):\/\//)) {
						replace = "http://" + linksFound[i];
					}
					let linkText = replace.split("/")[2];
					if (linkText.substring(0, 3) == "www") {
						linkText = linkText.replace("www.", "");
					}
					var youtube = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var match = replace.match(youtube);
					if (match && match[2].length == 11) {
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
							<a external href={replace} target="_blank">
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
				if (ind < text.split("\n").length - 1) {
					toReturn.push(<br></br>);
				}
				console.log(toReturn);

				if (!toReturn[0]) toReturn = null;
				return toReturn;
			});
			if (!text[0] || textContainsOnlyEmoji) text = null;

			if (textContainsOnlyEmoji) {
				end.push(<h1>{message.text}</h1>);
			}
		}

		return (
			<Message
				key={index}
				type={message.type}
				image={message.image}
				name={message.name}
				avatar={message.avatar}
				first={this.isFirstMessage(message, index)}
				last={this.isLastMessage(message, index)}
				tail={this.isTailMessage(message, index)}
			>
				{text && <div slot="text">{text}</div>}

				<div slot="content-end">{end}</div>
			</Message>
		);
	}

	get attachmentsVisible() {
		const self = this;
		return self.state.attachments.length > 0;
	}
	get placeholder() {
		const self = this;
		return self.state.attachments.length > 0 ? "Add comment or Send" : "Message";
	}

	componentDidMount() {
		const self = this;

		self.$f7ready(() => {
			self.messagebar = self.messagebarComponent.f7Messagebar;
			self.messages = self.messagesComponent.f7Messages;
			self.messagebar.$textareaEl[0].addEventListener("keypress", self.onKeyPress);
		});
	}

	componentWillUnmount() {
		this.messagebar.$textareaEl[0].removeEventListener("keypress", this.onKeyPress);
	}

	onKeyPress = (e) => {
		if (e.keyCode === 13 && this.$f7.device.desktop && !e.shiftKey) {
			e.preventDefault();
			console.log("send");
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
			});
		});
		if (text.trim().length) {
			messagesToSend.push({
				text,
			});
		}
		if (messagesToSend.length === 0) {
			return;
		}

		self.setState({
			// Reset attachments
			attachments: [],
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
)(HomePage);
// TODO
// apple-touch-startup-image
// PWA: https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native
