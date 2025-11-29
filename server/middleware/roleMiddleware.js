//used to verify specific user role to allow access to certain routes
function requireRole(role) {
    return function (req, res, next) {
        //console.log("require role check");
        if(!req.user) {
            //will also run if authMiddleware has not been run prior
            return res.status(401).json({ error: 'Missing or unauthenticated user' });
        }
        //console.log(`User role: ${req.user.role}, required role: ${role}`);
        if(req.user.role !== role) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
}
module.exports = requireRole;