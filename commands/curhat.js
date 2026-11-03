module.exports = {
  name: "curhat",
  description: "Curhat dengan persona Nara.",
  usage: "curhat <cerita>",
  async execute({ message, text, state, sessionKey, commandName }) {
    if (commandName === "endcurhat") return message.reply("Mode curhat belum aktif. Ketik .curhat untuk mulai.");
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return message.reply("Fitur curhat belum dikonfigurasi. Tambahkan GROQ_API_KEY ke file .env.");

    const session = state.curhatSessions.get(sessionKey) || [];
    if (!state.curhatSessions.has(sessionKey)) {
      state.curhatSessions.set(sessionKey, session);
      await message.reply("Hai, aku Nara. Kamu bisa cerita apa saja di sini. Kalau mau selesai, ketik .endcurhat.");
    }
    if (!text.trim()) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
          max_tokens: 350,
          messages: [
            { role: "system", content: "Kamu Nara, teman curhat yang hangat, akrab, sabar, peka, dan tidak menghakimi. ATURAN BAHASA WAJIB: semua balasan hanya dalam bahasa Indonesia. Jangan gunakan bahasa Inggris, Mandarin, bahasa asing lain, atau campuran bahasa. Terjemahkan istilah asing ke padanan Indonesia yang alami, misalnya komunikasi, pesan tidak dibalas, dan percakapan langsung. Jika pengguna memakai bahasa asing, tetap balas dalam bahasa Indonesia. Pakai gaya santai seperti teman dekat, bukan bahasa formal atau jawaban template. Tanggapi detail yang benar-benar diceritakan, validasi perasaan tanpa mengarang fakta, jangan buru-buru memberi solusi, dan ajukan paling banyak satu pertanyaan lembut bila membantu. Jangan mengaku manusia atau tenaga profesional. Jika pengguna menyebut bahaya langsung atau ingin menyakiti diri/orang lain, tanggapi serius dalam bahasa Indonesia dan sarankan segera menghubungi orang tepercaya serta layanan darurat setempat. Tetap menjadi Nara sepanjang percakapan." },
            ...session,
            { role: "user", content: text.slice(0, 4000) },
          ],
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Groq API error:", response.status, error.error?.code || error.error?.message || "unknown");
        return message.reply("Nara belum bisa membalas sekarang. Coba lagi nanti.");
      }
      const result = await response.json();
      const answer = result.choices?.[0]?.message?.content?.trim();
      if (!answer) return message.reply("Nara belum bisa membalas sekarang. Coba lagi nanti.");
      session.push({ role: "user", content: text.slice(0, 4000) }, { role: "assistant", content: answer.slice(0, 3500) });
      if (session.length > 12) session.splice(0, session.length - 12);
      return message.reply(answer.slice(0, 3500));
    } catch {
      return message.reply("Nara belum bisa dihubungi sekarang. Coba lagi nanti.");
    } finally {
      clearTimeout(timeout);
    }
  },
};
