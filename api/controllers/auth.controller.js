import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
    //hash the password
    const hashedpassword = await bcrypt.hash(password,10);

    console.log(hashedpassword, role);

    const user = await prisma.user.findUnique({
        where: {email}
    })

    if(user) return res.status(404).json({message: "User is already registered!!!"});

    //CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedpassword,
            role
        }
    });

    console.log(newUser);

    res.status(201).json({message: "User Created Successfully!!"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user!!!"})
    }
    

}

export const login = async (req, res) => {

    const { username, password, role} = req.body;
    console.log(req.body);

    try {
        //CHECK IF USER EXIST
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if(!user) return res.status(404).json({message: "User not found!!!"});


    //CHECK IF PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!!!"});

    if(user.role!=role) return res.status(403).json({ message: "Not Authorized"});

    //GENERATE COOKIE TOKEN AND SEND TO USER
        // res.setHeader("Set-Cookie", "test="+"myValue").json("success");
    const age = 1000 * 60 * 60 *24 *7;

    const token = jwt.sign({
        id:user.id,
        isAdmin: false,
        role: user.role
    }, "R7t7A=75t485tcehfru", { expiresIn: age})
    
    console.log("token while logging",token);

    const {password: userPassword, ...userInfo} = user;
    
    res.cookie("token", token, {
            httpOnly: true,
            //secure: true
            maxAge: age,
        })
        .status(200)
        .json(userInfo);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to login!!!"});
    }  

}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message:"Logout Successful!!"});
}