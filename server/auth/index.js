const jwt = require("jsonwebtoken")

function authManager() {
    verify = function (req, res, next) {
        try {
            const token = req.cookies.token;
            //console.log("token: ", token);
            if (!token) {
                //create the cookie here?

                //console.log("Invalid token!");
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId;

            next();
        } catch (err) {
            console.log("Something went wrong in verify!");
            console.error(err);
            return res.status(401).json({
                errorMessage: "Unauthorized"
            });
        }
    }

    signToken = function (user) {
        console.log("Signing token");
        return jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;