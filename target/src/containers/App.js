import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import HomeRoute from "../routes/HomeRoute";
import AboutRoute from "../routes/AboutRoute";
import PostRoute from "../routes/PostRoute";
import logo from '../images/logo.svg';
import '../css/App.css';
import {connect} from "react-redux";
import * as actions from "../actions";
import AppTitle from "../components/AppTitle"
import {Link} from "react-router-dom";
	


class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<AppTitle message={this.props.message}/>
				</header>
				<Router>
					<div>
						<div>
							<Link to='/'>홈으로</Link><br/>
							<Link to='/post'>게시판</Link><br/>
							<Link to='/post/test'>게시판테스트</Link><br/>
							<Link to='/about'>자세히</Link><br/>
						</div>
	
						<div className="app">
								<Route exact path="/" component={HomeRoute} />
								<Route exact path="/about" component={AboutRoute} />
								<Route exact path="/post" component={PostRoute} />
								<Route
									exact
									path="/post/:post_idx"
									component={PostRoute}
								/>
						</div>
					</div>
				</Router>
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
