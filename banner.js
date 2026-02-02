if (process.env.CI || process.env.ADBLOCK || process.env.DISABLE_OPENCOLLECTIVE) {
    process.exit(0);
}

const reset = "\x1b[0m";
const cyan = "\x1b[36m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const dim = "\x1b[2m";

console.log(`
${cyan}*******************************************************${reset}
${green}  Thanks for installing my package! 🚀${reset}
${cyan}*******************************************************${reset}

${yellow}  This project is community-supported.${reset}
  If it saves you time, please consider a donation:

  💎 ${green}Boosty (Cards/PayPal):${reset} https://boosty.to/antonvoronezh/donate
  🪙 ${green}Crypto (Telegram):${reset}     https://t.me/AntonVoronezhh/5

${dim}  (You can suppress this message using --no-optional)${reset}
`);
