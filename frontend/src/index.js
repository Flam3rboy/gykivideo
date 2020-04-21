import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "framework7/css/framework7.bundle.min.css";
import 'framework7-icons';
import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import Framework7 from "framework7/framework7.esm.bundle";
import Framework7React from "framework7-react";
import io from "socket.io-client";
import axios from "axios";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ws from "./ws";
import allReducers from "./reducers/";

const composeEnhancers =
	typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
				trace: true,
		  })
		: compose;

const enhancer = composeEnhancers();

const store = createStore(allReducers, enhancer);
axios.defaults.validateStatus = () => true;
const socket = io("http://localhost:2000");

global.socket = socket;
ws(socket);
Framework7.use(Framework7React);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
