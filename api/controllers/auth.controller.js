import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    

    try {

        const { username, email, password } = req.body;
    //hash the password
    const hashedpassword = await bcrypt.hash(password,10);

    console.log(hashedpassword);

    //CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedpassword
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

    const { username, password} = req.body;
    console.log("hello");

    try {
        //CHECK IF USER EXIST
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if(!user) return res.status(404).json({message: "User not found!!!"});


    //CHECK IF PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!!!"});

    //GENERATE COOKIE TOKEN AND SEND TO USER
        // res.setHeader("Set-Cookie", "test="+"myValue").json("success");
    const age = 1000 * 60 * 60 *24 *7;

    const token = jwt.sign({
        id:user.id,
        isAdmin: false
    }, "R7t7A=75t485tcehfru", { expiresIn: age})
    
    console.log("login successful");

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