import React from "react";
import { App, View, Page, Navbar, Toolbar, Link, Panel, Block, Col, Button } from "framework7-react";
import { connect } from "react-redux";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    log(t) {
        console.log(t)
    }

    render() {

        return (
            <Panel  panelOpened={this.log.bind(null, "open")} panelBackdropClick={this.log.bind(null, "closed")} opened={this.props.sidebar.open} right resizable themeDark>
                <View>
                    <Page>
                        <Block>Right panel content</Block>
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
