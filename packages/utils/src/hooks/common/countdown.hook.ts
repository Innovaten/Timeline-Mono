import { useEffect, useRef, useState } from "react";


export function useCountdown(start: number){

    if(start <= 0){
        return { count: 0, timeUp: true, resetCountdown: ()=>{}};
    }
    
    const [count, setCount] = useState(start);
    const timerRef = useRef<any>()
    const timeUp = count == 0 

    useEffect(() => {
        if(count > 0 ){
            timerRef.current = setTimeout(() => {
                setCount(prev => prev - 1)
            }, 1000)
    
            return () => {
                clearInterval(timerRef.current);
            }
        }
    }, [count])

    function resetCountdown(){
        setCount(start);
    }

    return { count, timeUp, resetCountdown }
}