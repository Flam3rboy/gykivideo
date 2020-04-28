import React from "react";
import { Page, Navbar, Link, List, ListInput, ListItem, Button, Card, CardHeader, CardContent } from "framework7-react";
import "./login.scss";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import gyki from "../../resources/gyki.png";
import { connect } from "react-redux";
import E2EE from "../../crypto/e2ee";

window.E2EE = E2EE;

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

		var privateKey, publicKey;
		var e2ee = new E2EE();

		var json = (await axios.post("/user/login", { role, username, password })).data;
		var { accessToken, user, needRSAKey } = json;
		if (!json.success) return this.setState({ error: json.error });

		accessToken = "Bearer " + accessToken;
		axios.defaults.headers.common["Authorization"] = accessToken;
		localStorage.setItem("token", accessToken);
		this.props.login(user);

		var AES = await e2ee.generateAES({ password, username });
		var jwkAES = await crypto.subtle.exportKey("jwk", AES);
		var da = 2;
		if (needRSAKey) {
			var RSA = await e2ee.generateRSA();
			privateKey = RSA.privateKey;
			publicKey = RSA.publicKey;

			var encryptedRSA = await e2ee.wrapRSAKeyWithAES({ RSA, AES });
			console.log({ encryptedRSA, RSA });

			encryptedRSA.publicKey = e2ee.toPem({
				publicKey: await crypto.subtle.exportKey("spki", RSA.publicKey),
			});

			await axios.post("/user/setKey", { RSA: encryptedRSA });
		} else {
			var { privateKey, publicKey } = user;
			privateKey = e2ee.fromPem(privateKey);
			publicKey = e2ee.fromPem(publicKey);

			try {
				publicKey = await crypto.subtle.importKey("spki", publicKey, e2ee.rsaAlg, true, []);
				privateKey = await crypto.subtle.unwrapKey("jwk", privateKey, AES, e2ee.aesAlg, e2ee.rsaAlg, true, [
					"decrypt",
				]);
			} catch (error) {
				console.error({ error });
			}
		}

		console.log({ privateKey, publicKey, AES, RSA });

		localStorage.setItem("publickey", e2ee.toPem({ publicKey: await crypto.subtle.exportKey("spki", publicKey) }));
		localStorage.setItem(
			"privatekey",
			e2ee.toPem({ privateKey: await crypto.subtle.exportKey("pkcs8", privateKey) })
		);
	};

	// var rsaAlg = {
	//     name: "RSA-OAEP",
	//     hash: "SHA-256",
	//     publicExponent: new Uint8Array([1, 0, 1]),
	//     modulusLength: 2048
	// };
	// var aesAlg = {
	//     name: "AES-GCM",
	//     length: 256,
	//     iv: crypto.getRandomValues(new Uint8Array(12)),
	// };

	// var e2ee = new E2EE();
	// var rsa = await e2ee.generateRSA();
	// var aes = await e2ee.generateAES({username:"test",password:"test"})
	// var wrap = await crypto.subtle.wrapKey("jwk", rsa.privateKey, aes, aesAlg);
	// wrap = e2ee.fromPem(e2ee.toPem({privateKey: wrap}))
	// var unwrap = await crypto.subtle.unwrapKey("jwk", wrap, aes, aesAlg, rsaAlg, true, ["decrypt"]);

	render() {
		if (this.props.user.loggedin) {
			if (window.InitialPage === "/login/") window.InitialPage = "/";
			this.$f7router.navigate(window.InitialPage, { animate: false, pushState: true });
		}

		if (!this.state.show) return <div></div>;

		return (
			<Page name="login" noToolbar noNavbar noSwipeback loginScreen>
				<div className="module">
					<Navbar title="Videokonferenz - Login" />
					<Container className="module-inside">
						<Row className="justify-content-center align-content-center row-module">
							<Col className="col-md-9 col-lg-6 col" style={{ padding: "0" }}>
								{/* <p class="pen">Login - Gyki - Video</p> */}
								<Card className="demo-card-header-pic">
									<CardHeader className="no-border card-header-img" valign="bottom">
										<Container>
											<Row className="justify-content-center ">
												<img className="col-10 col-md-8 col-lg-10" src={gyki}></img>
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
	(s) => ({ user: s.user }),
	(dispatch) => {
		return {
			login: (user) => {
				dispatch({ type: "LOGIN", payload: user });
			},
			logout: (user) => dispatch({ type: "LOGOUT", payload: user }),
		};
	}
)(LoginPage);
