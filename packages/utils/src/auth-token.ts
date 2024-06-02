
export function _getToken(){
    return sessionStorage.getItem('timeline-token')
}

export function _setToken(token: string){
    sessionStorage.setItem("timeline-token", token)
}

export function _clearToken(){
    sessionStorage.removeItem('timeline-token')
} 

