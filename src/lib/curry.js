/**
 * Returns a curried equivalent of the provided function.
 *
 * @param {function} func   Function to curry
 * @return {function} curried   Curried version of the passed function
 */
const curry = func =>
    function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(null, args);
        } else {
            return (...restArgs) => {
                return curried.apply(null, args.concat(restArgs));
            };
        }
    };

module.exports = curry;
