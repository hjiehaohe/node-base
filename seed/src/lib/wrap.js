module.exports = (fn) => {
    return (req, res, next) => {
        return fn(req, res).catch((err) => next(err));
    }
}