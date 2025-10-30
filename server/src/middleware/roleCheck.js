// require specific roles 
const roleCheck =(...allowedRoles)=>{
    return (req, res, next)=>{
        if(!req.user){
            return res.status(401).json({ 
            error: 'Authentication required',
            });
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                error: `Access denied: insufficient permissions  , Required role:  ${allowedRoles.join(' or ')}`,
                requiredRoles: allowedRoles,
                userRole: req.user.role
            })
        }
        next();
    }
}
// require admin role
const adminCheck = roleCheck('admin');
// reqquire VISITOR OR ADMIN role
const visitorOrAdminCheck = roleCheck('visitor', 'admin');

export {
    roleCheck,
    adminCheck,
    visitorOrAdminCheck
}