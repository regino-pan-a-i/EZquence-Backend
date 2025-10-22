const Util = {}
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

Util.verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: 'Invalid token' });
  }
}


Util.verifyAdmin = (req, res, next) => {
  try {
    // If verifyUser middleware didn't run or token was missing/invalid
    if (!req.user) {
      return res.status(401).json({ error: 'No token or invalid token' });
    }

    const role = (req.user.user_role || '').toString().toUpperCase();
    if (role === 'ADMIN') return next();

    // Authenticated but not an admin
    return res.status(403).json({ error: 'Forbidden: admin only' });
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
module.exports = Util;