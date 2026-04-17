import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message:"You have no token"});

    const token = authHeader.split(" ").filter(Boolean)[1];;


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).json({message: "Invalid Token"});
    }
};