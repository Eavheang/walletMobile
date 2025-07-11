import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try{
        const {success} = await ratelimit.limit("my-limit-rate")
        if(!success){
            return res.status(429).json({message: "Too many requests"})
        }
        next()
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

export default ratelimiter