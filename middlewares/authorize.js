import jwt from "jsonwebtoken";

const authorize = (allowedRoles) => (req, res, next) => {
    try {
        // let token = req.headers.authorization?.split(' ')[1] || null;
        let token = req.cookies.token || null;
        // return console.log("Token from cookie:", token);
        
        if (!token) {
            return res.status(401).json({ 
                error: "Access denied. No token provided." 
            });
        }

        // const decoded = jwt.verify(token, process.env.SECRETKEY);
        // req.user = decoded;
         const decoded = jwt.verify(token, process.env.SECRETKEY);
        req.user = decoded;
       
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied. Insufficient permissions.' 
            });
        }

        next();
    } catch (err) {
        console.error('Token verification error:', {
            message: err.message,
            name: err.name,
            timestamp: new Date().toISOString()
        });
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

export default authorize;
