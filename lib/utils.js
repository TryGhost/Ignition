var findRoot = require('find-root');
var caller = require('caller');

/**
 * caller dependency is able to detect the calling unit
 * they are doing this with the trick of creating an error stack
 * caller(2) means -> get me the previous calling unit
 *
 * Example Structure:
 * Ghost
 *    node_modules
 *       ghost-ignition
 *       passport-ghost
 *
 * Ghost uses ghost-ignition and passport-ghost uses ghost-ignition.
 *
 * If passport-ghost calls ghost-ignition, caller(2) would return the last caller of this module
 * If Ghost calls ghost-ignition, caller(2) would return the last caller of this module
 * And findRoot will be able to get the latest path with a valid package.json
 */
exports.getParentPath = function getParent() {
    try {
        return findRoot(caller(2));
    } catch (err) {
        return;
    }
};