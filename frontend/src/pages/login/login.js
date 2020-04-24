import React from "react";
import { Page, Navbar, Link, List, ListInput, ListItem, Button, Card, CardHeader, CardContent } from "framework7-react";
import "./login.scss";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import gyki from "../../resources/gyki.png";
import { connect } from "react-redux";

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ show: true });
		}, 100);
	}

	saveInput = (e) => {
		e = e.target;
		var set = {};

		set[e.name] = e.value;
		this.setState(set);
	};

	login = async () => {
		var { role, username, password } = this.state;

		var json = (await axios.post("/user/login", { role, username, password })).data;

		if (!json.success) return this.setState({ error: json.error });
		var { accessToken, user } = json;
		accessToken = "Bearer " + accessToken;
		localStorage.setItem("token", accessToken);
		this.props.login(user);
		this.$f7router.navigate(window.InitialPage, { animate: true, pushState: true });
	};

	render() {
		if (this.props.user.loggedin) {
			this.$f7router.navigate(window.InitialPage, { animate: false, pushState: true });
		}

		if (!this.state.show) return <div></div>;

		return (
			<Page name="login" noToolbar noNavbar noSwipeback loginScreen>
				<Navbar title="Videokonferenz - Login" />
				<div className="module">
					<Container className="module-inside">
						<Row className="justify-content-center align-content-center row-module">
							<Col className="col-md-9 col-lg-6">
								{/* <p class="pen">Login - Gyki - Video</p> */}
								<Card className="demo-card-header-pic">
									<CardHeader className="no-border card-header-img" valign="bottom">
										<Container>
											<Row className="justify-content-center ">
												<img className="col col-md-8 col-lg-10" src={gyki}></img>
											</Row>
											<Row className="text-align-center">
												<p>Videokonferenz Plattform vom Gymnasium Kirchheim</p>
											</Row>
										</Container>
									</CardHeader>
									<CardContent className="p-3">
										<form>
											<List noHairlinesMd>
												<ListInput
													label="Name"
													autocomplete="username"
													type="text"
													name="username"
													placeholder="Dein Nutzername"
													clearButton
													onChange={this.saveInput}
												></ListInput>
												<ListInput
													label="Passwort"
													autocomplete="current-password"
													type="password"
													name="password"
													placeholder="Dein Passwort"
													clearButton
													onChange={this.saveInput}
												></ListInput>
												<ListItem
													className="LoginRadioStudent"
													radio
													title="Schüler"
													name="role"
													value="student"
													defaultChecked
													onChange={this.saveInput}
												></ListItem>
												<ListItem
													className="LoginRadioTeacher"
													radio
													title="Lehrer"
													value="teacher"
													name="role"
													onChange={this.saveInput}
												></ListItem>
											</List>
											<Row className="justify-content-center">
												<Button onClick={this.login} large raised fill className="submit">
													Einloggen
												</Button>
											</Row>
										</form>
									</CardContent>
								</Card>
							</Col>
						</Row>
						{/* <Row className="footer justify-content-center">
							<Col lg="auto">
								<Link
									className="github"
									href="https://github.com/Flam3rboy/gykivideo"
									target="_blank"
									external
								>
									Github
								</Link>
							</Col>
						</Row> */}
					</Container>
				</div>
			</Page>
		);
	}
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			login: (user) => {
				dispatch({ type: "LOGIN", payload: user });
				dispatch({ type: "SIDEBAR_OPEN", payload: user });
			},
			logout: (user) => dispatch({ type: "LOGOUT", payload: user }),
		};
	}
)(LoginPage);
