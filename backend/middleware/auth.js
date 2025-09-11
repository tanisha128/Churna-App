const jwt = require ('jsonwebtoken');


function auth(req, res, next) {
const authHeader = req.headers.authorization || '';
const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
if (!token) return res.status(401).json({ message: 'No token' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // { id, role }
next();
} catch (e) {
res.status(401).json({ message: 'Invalid token' });
}
}


function isAdmin(req, res, next) {
if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
next();
}

module.exports = { auth, isAdmin };