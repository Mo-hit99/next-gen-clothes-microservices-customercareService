import redis from 'redis'

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
})

redisClient.on('error',(error)=>{
    console.error('redis connection error',error)
})


const redisDatabaseConnection = async ()=>{
    try {
        await redisClient.connect();
        const pong= await redisClient.ping()
        console.log('redis database connection completed!',pong)
    } catch (error) {
        console.log('-----> error occurred <-----' , error)
    }
}


export {redisClient , redisDatabaseConnection};