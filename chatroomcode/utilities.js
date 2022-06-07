/*
UTILITIES

Utility functions that help other modules operate successfully.

List of Utilities
-----------------
randomNumberGenerator
*/

//randomNumberGenerator
// Accepts a min and max value and generates a random integer between those values
// Could be the min or max values in addition to all intermediate integers
var randomNumberGenerator = function(min=0, max)
{
    return Math.floor(Math.random() * ((max + 1) - min) + min)
}

module.exports = {
    randomNumberGenerator: randomNumberGenerator
}