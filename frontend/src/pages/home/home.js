import React from "react";
import { App, View, Page, Navbar, Toolbar, Link } from "framework7-react";
import { connect } from "react-redux";
class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidUpdate() {
		console.log(this.props.user.loggedin);
		if (!this.props.user.loggedin) {
			this.$f7router.navigate("/login/", { animate: false, pushState: true });
		}
	}

	render() {
		return (
			<Page name="home">
				<Navbar title="Home Page" />
				<Link back href="/about/">
					About Page
				</Link>
				<Link loginScreenOpen href="/login/">
					Login Page
				</Link>
			</Page>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			login: (user) => dispatch({ type: "LOGIN", payload: user }),
			logout: (user) => dispatch({ type: "LOGOUT", payload: user }),
		};
	}
)(HomePage);
