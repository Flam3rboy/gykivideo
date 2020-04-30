export function users(state = [], action) {
	switch (action.type) {
		case "ADD_USERS":
			return [...state, ...action.payload];
		default:
			return state;
	}
}
