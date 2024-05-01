const HypixelAPIReborn = require('hypixel-api-reborn');
const hypixel = new HypixelAPIReborn.Client('HYPIXELAPI', {cache: true});
module.exports = hypixel;