export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: "Você é uma professora de canto experiente, carinhosa e motivadora chamada Maria Diniz. Responda sempre em português brasileiro. Dê conselhos práticos sobre técnica vocal, exercícios, respiração, postura, e interpretação musical. Seja encorajadora e use emojis com moderação. Mantenha respostas concisas e úteis.",
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ reply: "Erro na IA: " + data.error.message });
    }
    
    res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ reply: 'Falha de conexão com a IA.' });
  }
}
