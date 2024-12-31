exports.checkUserId = (req, res, next) => {
    // Check if the 'userid' header is present
    if (!req.headers.userid) {
      return res.status(401).json({ message: 'userId header is missing' });
    }
    // Proceed to the next middleware or route handler if the header is present
    return next();
}