
export function _getToken(){
    return sessionStorage.getItem('timeline-token')
}

export function _getTokenExpiration(){
    return sessionStorage.getItem('timeline-token-expiration')
}

export function _setToken(token: string){
    sessionStorage.setItem("timeline-token", token)
}

export function _clearTokens(){
    sessionStorage.removeItem('timeline-token')
    sessionStorage.removeItem('timeline-token-expiration')
    sessionStorage.removeItem('timeline-user')
} 

export function _getUser(){
    const rawUser = sessionStorage.getItem('timeline-user')
    if(!rawUser || rawUser == ""){
        return null;
    }
    return JSON.parse(rawUser);
}

export function _setUser(user: any){
    sessionStorage.setItem("timeline-user", JSON.stringify(user))
}

export function _setTokenExpiration(expirationDate: string){
    return sessionStorage.setItem('timeline-token-expiration', expirationDate)
}