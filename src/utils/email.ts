export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, subject, html })
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar e-mail via servidor local.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na integração de e-mail:', error);
    throw error;
  }
};
