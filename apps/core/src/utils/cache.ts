import { Redis } from 'ioredis'
import { CoreConfig } from '../config'

export const redis = new Redis({
  ...CoreConfig.redis
 })

redis.on('connect', () => {
  console.log('--- Redis Connected ---')
})

redis.on('error', (err) => {
  console.log(CoreConfig.redis)
  console.log('### Redis Error:', err.message)
})

export async function setCache(key: string, values: any){
  return redis.set(key, JSON.stringify(values), 'EX', 60)
}

export function flushExistingKeysThatMatch(pattern: string){

  let pipeline = redis.pipeline()
  let stream = redis.scanStream({ match: pattern, count: 10000 })

  stream.on('data', (keys) => {
    pipeline.del(keys)
  })

  stream.on('end', () => {
    pipeline.exec(() => { console.log("Upstream key flush complete") })
  })

  stream.on('error', (err) => {
    console.error("### Redis flush error:", err.message)
  })

}