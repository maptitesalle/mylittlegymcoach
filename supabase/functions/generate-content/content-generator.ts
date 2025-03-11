
// Fonction pour générer le contenu avec OpenAI
export async function generateContent(
  prompt: string, 
  type: string, 
  openAIApiKey: string | undefined,
  getSystemPrompt: (type: string) => string,
  getMaxTokens: (type: string) => number
): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API Key not provided');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: getSystemPrompt(type)
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: getMaxTokens(type),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur de l\'API OpenAI:', errorData);
    throw new Error(`Erreur de l'API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Réponse inattendue de l\'API OpenAI');
  }
  
  return data.choices[0].message.content;
}
