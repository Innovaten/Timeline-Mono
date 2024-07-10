
import { generate } from 'generate-password'


export function generateSecurePassword(){
    let randomPassword = generate({ 
        length: 7, 
        strict: true 
    })
    const passwordWithNumbers = randomPassword + ["!","@","#","$","^","*","&"][ Math.floor(Math.random() * 6) ] + [Math.abs(Math.floor((Math.random() * 149)-97))]

    return passwordWithNumbers;
}