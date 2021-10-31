const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const Cookies =  require('js-cookie');

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        }).send();
    })
}
// getLoggedIn = async (req, res) => {
//     try{
//         res = auth.verify(req, res, async function () {
//             const loggedInUser = await User.findOne({ _id: req.userId });
//             return res.status(200).json({
//                 loggedIn: true,
//                 user: {
//                     firstName: loggedInUser.firstName,
//                     lastName: loggedInUser.lastName,
//                     email: loggedInUser.email
//                 }
//             }).send();
//         })
//         console.log("after auth.verify, res: ", res);
//         if(res.statusCode === 401){
//             console.log("Hey we caught the status code!");
//             return res.status(200).json({
//                 loggedIn: false,
//                 user: null
//             }).send();
//         }
//     }catch(err){
//         console.log("Hey we caught the error");
//     }
// }

logoutUser = async (req, res) => {
    auth.verify(req, res, async function () {
        //const loggedInUser = await User.findOne({ _id: req.userId });
    try{
        //let token = document.cookie.token;
        var token = Cookies.get("token");
        await res.cookie("token", token, {
            expires: new Date(Date.now() - 900000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
        return res.status(200).json({
            loggedIn: false,
            user: null
        }).send();
    })
}

loginUser = async (req, res) => {
    console.log("Inside loginUser!");
    //auth.verify(req, res, async function () {
        console.log("Trying to log in the user, heres the request details: ", req.body);
        const { email, password } = req.body;
        //BREAK ON A MISSING EMAIL OR PASSWORD
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("Email we're querying by: ", email);
        const loggedInUser = await User.findOne({ email: email });
        console.log("loggedInUser: ", loggedInUser);
        //BREAK IF WE CAN'T FIND THE EMAIL
        if(loggedInUser === null){
            return res
            .status(400)
            .json({ errorMessage: "Bad Email!"});
        }
        //need to check the password here
        bcrypt.compare(password, loggedInUser.passwordHash, (err, result) => {
            if (err) return callback(err);
            if (!result){
                console.log("Passwords are not the same!");
                return res.status(400).json({ errorMessage: "Bad password!"});
            }
        });
        console.log("Login successful!");
        //If everything is good, create a token (we shouldn't necessarily have one)
        token = Cookies.get("token");
        if(!token){
            try{
                console.log("attempting to create a token");
                token = auth.signToken(loggedInUser);
                await res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    user: {
                        firstName: loggedInUser.firstName,
                        lastName: loggedInUser.lastName,
                        email: loggedInUser.email
                    }
                }).send();
            }catch (err) {
                console.error(err);
                res.status(500).send();
            }
        }
        //auth.verify(req, res, async function (){}
        return res.status(200).json({
            //req: req,
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        }).send();
    //})
}

registerUser = async (req, res) => {
    try {
        console.log("Attempting to register the user");
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();
        console.log("newUser: ", newUser);
        console.log("saveduser: ", savedUser);
        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}