import lodash from 'lodash'

export async function generateCode(count: number, prefix: string, length = 6){
    return prefix + lodash.padStart(`${++count}`, length, "0");           
}