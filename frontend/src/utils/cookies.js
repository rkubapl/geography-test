export function getCookie(key) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export function deleteCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

export function setCookie(cname, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + value + ";" + expires + ";path=/";
}