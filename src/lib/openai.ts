// src/lib/openai.ts
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function classifyTicket(text: string) {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `Ти AI-асистент для класифікації заявок ОСББ. Поверни ТІЛЬКИ JSON:
{
  "type": "Аварія" | "Поломка" | "Скарга" | "Інфо_запит",
  "priority": "високий" | "середній" | "низький",
  "summary": "короткий опис (2-3 слова)",
  "object": "об'єкт (труба, ліфт, світло тощо)"
}`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');

    const parsed = JSON.parse(content);
    return {
      type: parsed.type || 'Інфо_запит',
      priority: parsed.priority || 'низький',
      summary: parsed.summary || text.slice(0, 40),
      object: parsed.object || 'інше'
    };
  } catch (error) {
    console.error('AI Error:', error);
    return { type: 'Інфо_запит', priority: 'низький', summary: text.slice(0, 40), object: 'інше' };
  }
}