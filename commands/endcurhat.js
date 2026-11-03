module.exports = {
  name: "endcurhat",
  description: "Mengakhiri mode curhat Nara.",
  usage: "endcurhat",
  async execute({ message, state, sessionKey }) {
    if (!state.curhatSessions.has(sessionKey)) return message.reply("Mode curhat belum aktif. Ketik .curhat untuk mulai.");
    state.curhatSessions.delete(sessionKey);
    return message.reply("Mode curhat selesai. Kalau butuh Nara lagi, ketik .curhat.");
  },
};
