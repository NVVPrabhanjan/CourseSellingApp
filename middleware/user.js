import jwt from 'jsonwebtoken';
const JWT_SECRET = "process.env.JWT_USER_PASSWORD";
function userMiddleware(req, res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_SECRET);

    if(decoded){
        req.userId = decoded.indexOf;
        next();
    }
    else{
        res.status(403).json({
            message : "You are no signed in"
        })
    }
}
export { userMiddleware };