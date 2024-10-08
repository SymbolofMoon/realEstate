import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next)=>{
    const token = req.cookies.token;
    console.log(token);
    if(!token) return res.status(401).json({message: "Not Authenticated!!!"});
    

    jwt.verify(token, "R7t7A=75t485tcehfru", async(err, payload)=> {
        if(err) return res.status(403).json({message:"Token is not valid"});

        req.userId = payload.id;
        next();
    });

}