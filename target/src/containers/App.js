import logo from '../images/logo.svg';
import '../css/App.css';
import React, {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import AppTitle from "../components/AppTitle"

class App extends Component {
	constructor(props) {
		super(props);
	}
	componentWillUnmount() {
		console.log("This function will be called when its component umounts.");
	}
	componentDidMount() {
		console.log("This function will be called when its component mounted.");
	}
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<AppTitle message={this.props.message}/>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
			</div>
		);
	}
}

const mapStateToPrpos = state => {
	return {
		message: state.messageReducer.message
	};
};

const mapDispatchToProps = dispatch => {
	return {
		handleChaneMessage: (message) => {
			dispatch(actions.changeMessage(message));
		}
	};
};
export default connect(mapStateToPrpos, mapDispatchToProps)(
	App
);
