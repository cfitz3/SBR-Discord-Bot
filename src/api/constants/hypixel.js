const HypixelAPIReborn = require('hypixel-api-reborn')
const config = require('../../../config.json')

const hypixel = new HypixelAPIReborn.Client(config.api.hypixel_api_token, {cache: true});
module.exports = hypixel;