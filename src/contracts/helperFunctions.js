function formatUsername(username, gamemode) {
  if (gamemode === "ironman") return `♲ ${username}`;
  if (gamemode === "bingo") return `Ⓑ ${username}`;
  if (gamemode === "island") return `	☀ ${username}`;

  return username;
}

function formatNumber(number, decimals = 2) {
  if (number === undefined || number === 0) return 0;

  const isNegative = number < 0;

  if (number < 100000 && number > -100000) return parseInt(number).toLocaleString();

  const abbrev = ["", "K", "M", "B", "T", "Qa", "Qi", "S", "O", "N", "D"];
  const unformattedNumber = Math.abs(number);

  const abbrevIndex = Math.floor(Math.log10(unformattedNumber) / 3);
  const shortNumber = (unformattedNumber / Math.pow(10, abbrevIndex * 3)).toFixed(decimals);

  return `${isNegative ? "-" : ""}${shortNumber}${abbrev[abbrevIndex]}`;
}

function replaceVariables(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

module.exports = {
  formatUsername,
  formatNumber,
};