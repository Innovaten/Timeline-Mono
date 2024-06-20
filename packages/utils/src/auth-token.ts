
export function _getToken(){
    return sessionStorage.getItem('timeline-token')
}

export function _setToken(token: string){
    sessionStorage.setItem("timeline-token", token)
}

export function _clearToken(){
    sessionStorage.removeItem('timeline-token')
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