import { user } from "./user";
import { dms } from "./dms";
import { users } from "./users";
import { location } from "./location";
import { combineReducers } from "redux";

export default combineReducers({ user, location, users, dms });
