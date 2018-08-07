import React from "react";
//import {Link} from "react-router-dom";
	
//<Link to="/">

const HomeRoute = ({match}) => {
	let contents = {
		fontSize : "large"
	};

	//console.log(match.params.toon_info_idx);
	return ( 
		<div style={contents}>
			Welcome to home page!!
		</div>
	);
};

export default HomeRoute;

