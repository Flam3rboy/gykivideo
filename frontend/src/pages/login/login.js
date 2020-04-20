import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, List, ListInput, Icon, Range, ListItem, Button } from "framework7-react";
import "./login.scss"
import { Container, Col, Row } from "react-bootstrap"

export default () => (
	<Page name="login">
		<Navbar title="Login - GyKi" />
		<div className="module">
			<Container className="module-inside">
				<Row className="justify-content-md-center">
					<Col className="col-md-8 col-lg-6">
						{/* <p class="pen">Login - Gyki - Video</p> */}
						<List inlineLabels noHairlinesMd>
							<ListInput
								label="Name"
								type="text"
								placeholder="Your name"
								clearButton
							>
							</ListInput>
							<ListInput
								label="Password"
								type="password"
								placeholder="Your password"
								clearButton
							>
							</ListInput>
							<ListItem className="LoginRadioStudent" radio title="Schüler" name="demo-radio" value="Schüler" defaultChecked></ListItem>
							<ListItem className="LoginRadioTeacher" radio title="Lehrer" value="Lehrer" name="demo-radio"></ListItem>

							<Row className="justify-content-md-center">
								<Button large raised fill className="submit">Submit</Button>
							</Row>
						</List>
					</Col>
				</Row>
				<Row className="footer justify-content-md-center">
					<Col lg="auto">
						<Link className="github" href="https://github.com/Flam3rboy/gykivideo" target="_blank" external>Github</Link>
					</Col>
				</Row>
			</Container>
		</div>

	</Page>
);
