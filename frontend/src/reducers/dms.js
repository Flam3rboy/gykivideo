export function dms(state = [], action) {
	switch (action.type) {
		case "ADD_DM":
			return [...state, ...action.payload];
		default:
			return state;
	}
}
