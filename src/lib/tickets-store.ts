import { Ticket } from '@/types/ticket';

// In-memory storage (for demo purposes)
let tickets: Ticket[] = [];
let ticketCounter = 0;

// Генерація номера заявки: ММДД01, ММДД02, etc.
const generateTicketId = (): string => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  
  const prefix = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  ticketCounter++;
  
  return `${prefix}${ticketCounter.toString().padStart(2, '0')}`;
};

export const ticketsStore = {
  getAll: () => {
    return tickets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getById: (id: string) => {
    return tickets.find(t => t.id === id);
  },

  create: (data: { text: string; apartment: string; phone?: string }) => {
    const newTicket: Ticket = {
      id: generateTicketId(),
      text: data.text,              // ✅ Зберігаємо оригінальний текст
      apartment: data.apartment,
      phone: data.phone,
      // Дефолтні значення для AI-полів (будуть оновлені пізніше)
      type: 'інфо_запит',
      priority: 'низький',
      summary: data.text.slice(0, 50),
      object: null,
      status: 'нова',
      created_at: new Date().toISOString(),
    };

    tickets.push(newTicket);
    return newTicket;
  },

  updateStatus: (id: string, status: Ticket['status']) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      return ticket;
    }
    return null;
  },

  updateClassification: (id: string, classification: { type: string; priority: string; summary: string; object: string }) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.type = classification.type as Ticket['type'];
      ticket.priority = classification.priority as Ticket['priority'];
      ticket.summary = classification.summary;
      ticket.object = classification.object;
      return ticket;
    }
    return null;
  },

  clear: () => {
    tickets = [];
    ticketCounter = 0;
  }
};