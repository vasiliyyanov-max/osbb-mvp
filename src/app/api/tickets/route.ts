import { NextResponse } from 'next/server';
import { ticketsStore } from '@/lib/tickets-store';

export async function GET() {
  const tickets = ticketsStore.getAll();
  return NextResponse.json({ tickets });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    const updated = ticketsStore.updateStatus(id, status);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Заявку не знайдено' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}