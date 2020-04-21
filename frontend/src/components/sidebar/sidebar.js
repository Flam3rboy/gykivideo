import "./sidebar.scss"
import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, Panel, Block, Col, Button, Icon } from "framework7-react";
import { connect } from "react-redux";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {

        return (
            <Panel  onPanelOpened={this.props.open}
                    onPanelClosed={this.props.close}
                    opened={this.props.sidebar.open}
                    left resizable themeDark>
                <View>
                    <Page>
                        <Navbar title="Videokonferenz"></Navbar>
                        <Block>
                            <Link className="side-item">
                                <Icon f7="house"></Icon>
                                Startseite
                            </Link>
                        </Block>
                        <Block>
                            <Link className="side-item">
                                <Icon f7="​​chat_bubble_2_fill"></Icon>
                                Direktnachrichten
                            </Link>
                        </Block>
                        <Block>
                            <Link className="side-item">
                                <Icon f7="​​person_3_fill"></Icon>
                                Teams/Klassen
                            </Link>
                        </Block>
                        <Block>
                            <Link className="side-item">
                                <Icon f7="​​gear_alt_fill"></Icon>
                                Einstellungen
                            </Link>
                        </Block>
                    </Page>
                </View>
            </Panel>
        );
    }
}

export default connect(
	(s) => s,
	(dispatch) => {
		return {
			close: () => dispatch({ type: "SIDEBAR_CLOSE" }),
			open: () => dispatch({ type: "SIDEBAR_OPEN" }),
		};
	}
)(Sidebar);
