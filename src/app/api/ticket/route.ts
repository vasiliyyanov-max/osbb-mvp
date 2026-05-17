import { NextRequest, NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/openai';
import { ticketsStore } from '@/lib/tickets-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, apartment, contact } = body;

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: 'Текст занадто короткий' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Повідомлення мешканця: "${text}"` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0].message.content;
    const classifiedTicket = aiResponse ? JSON.parse(aiResponse) : null;

    console.log('🤖 Groq AI классификация:', classifiedTicket);

    // Сохраняем заявку
    const savedTicket = ticketsStore.create({
      text,
      apartment: apartment || '',
      contact: contact || '',
      classification: classifiedTicket,
    });

    console.log('💾 Заявка сохранена:', savedTicket.id);

    return NextResponse.json({
      success: true,
      message: 'Заявку успішно створено',
      ticket_id: savedTicket.id,
      classification: classifiedTicket,
    });

  } catch (error: any) {
    console.error('❌ Ticket API error:', error);
    return NextResponse.json(
      { error: 'Не вдалося створити заявку: ' + error.message },
      { status: 500 }
    );
  }
}