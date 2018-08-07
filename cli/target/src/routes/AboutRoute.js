import React from "react";

//console.log(match.params.toon_info_idx);
const AboutRoute = ({match}) => {
	let contents = {
		fontSize : "large"
	};
	return ( 
		<div style={contents}>
			Welcome to about page!!
		</div>
	);
};

export default AboutRoute;
