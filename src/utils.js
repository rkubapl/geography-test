export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function isURL(url) {
    try {
        new URL(url);
    } catch (e) {
        return false;
    }
    return true;
}

export const allowedDomains = ["imgur.com", "geografia24.eu"]

function getDomain(url) {
    const domain = url.split('.').slice(-2).join('.');
    console.log(domain)
    return domain;
}
export function isAllowedDomain(domain) {
    console.log(domain)
    console.log(getDomain(domain))
    for (let allowedDomain of allowedDomains) {
        if(allowedDomain.includes(getDomain(domain))) return true;
    }
    return false
}