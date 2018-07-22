import React from "react";

const PostRoute = ({match}) => {
	let contents = {
		fontSize : "large"
	};
	return ( 
		<div style={contents}>
			Welcome to post page({match.params.post_idx})!!
		</div>
	);
};

export default PostRoute;
