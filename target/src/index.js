import {Provider} from "react-redux";
import {createStore} from "redux";
import ReactDom from "react-dom";
import React from "react";
import registerServiceWorker from './js/registerServiceWorker';
import reducers from "./reducers";
import App from './components/App';
import './css/index.css';

// 스토어
const store = createStore(reducers);
ReactDom.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);

registerServiceWorker();
