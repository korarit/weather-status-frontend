
export function hasTokenSession() {
    if (localStorage.getItem('token_session') != null) {
        return true;
    } else {
        return false;
    }
}