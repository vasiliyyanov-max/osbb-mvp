import { NextRequest, NextResponse } from 'next/server';
import { ticketsStore } from '@/lib/tickets-store';
import { classifyTicket } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, apartment, phone } = body;

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: 'Текст занадто короткий або відсутній' },
        { status: 400 }
      );
    }

    // Створюємо заявку
    const ticket = ticketsStore.create({
      text,
      apartment,
      phone,
    });

    // AI класифікація (асинхронно, не блокуємо відповідь)
    classifyTicket(text)
      .then((classification) => {
        ticketsStore.updateClassification(ticket.id, classification);
        console.log(`🤖 AI класифікація для заявки ${ticket.id}:`, classification);
      })
      .catch((err) => {
        console.error('❌ Помилка AI класифікації:', err);
      });

    console.log(`✅ Нова заявка створена: ${ticket.id}`);
    
    // ПОВЕРТАЄМО ID!
    return NextResponse.json({ 
      id: ticket.id,
      message: 'Заявку прийнято'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Помилка створення заявки:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}