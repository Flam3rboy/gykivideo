import React from "react";
import { Icon } from "framework7-react";

export default (user) => {
	if (user && user.image) {
		return <img slot="media" src={user.image} />;
	} else {
		return <Icon slot="media" f7="person_crop_circle"></Icon>;
	}
};
