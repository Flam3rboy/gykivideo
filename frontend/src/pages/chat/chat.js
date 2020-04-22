import React from "react";
import {
	Page,
	Navbar,
	NavTitle,
	Messagebar,
	Link,
	MessagebarAttachment,
	MessagebarAttachments,
	Messages,
	MessagebarSheet,
	Message,
	MessagebarSheetImage,
	MessagesTitle,
} from "framework7-react";
import { connect } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { CardBody } from "react-bootstrap/Card";

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
					<NavTitle>Chats</NavTitle>
				</Navbar>
				<Messagebar
					placeholder={this.placeholder}
					ref={(el) => {
						this.messagebarComponent = el;
					}}
					attachmentsVisible={this.attachmentsVisible}
					sheetVisible={this.state.sheetVisible}
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
					<Link
						iconIos="f7:arrow_up_circle_fill"
						iconAurora="f7:arrow_up_circle_fill"
						iconMd="material:send"
						slot="inner-end"
						onClick={this.sendMessage.bind(this)}
					></Link>
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
					ref={(el) => {
						this.messagesComponent = el;
					}}
				>
					<MessagesTitle>
						<b>Sunday, Feb 9,</b> 12:58
					</MessagesTitle>

					{this.state.messagesData.map((message, index) => (
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
							{message.text && <span slot="text" dangerouslySetInnerHTML={{ __html: message.text }} />}
						</Message>
					))}
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
