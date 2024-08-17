import jwt from "jsonwebtoken";

export const verifyRole = async(req, res, next)=>{
    const role = req.body.role;
    console.log(role);
    if(!role) return res.status(401).json({message: "Please assign the role!!!"});
    

    jwt.verify(token, "R7t7A=75t485tcehfru", async(err, payload)=> {
        if(err) return res.status(403).json({message:"Token is not valid"});

        req.userId = payload.id;
        next();
    });

}