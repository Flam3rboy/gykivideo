
export function sidebar(state = { open: true }, action) {
    switch (action.type) {
        case "SIDEBAR_CLOSE":
            return { open: false };
        case "SIDEBAR_OPEN":
            return { open: true };
        default:
            return state;
    }
}
