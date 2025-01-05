// pages/api/qwen.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input } = req.body;

  try {
    // Aqui você deve substituir pela URL correta do seu endpoint Gradio
    const response = await fetch('SUA_URL_DO_GRADIO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input,
        api_name: '/on_example'
      }),
    });

    if (!response.ok) {
      throw new Error(`API respondeu com status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao chamar API Qwen:', error);
    res.status(500).json({ 
      message: 'Erro ao processar requisição', 
      error: error.message 
    });
  }
}
