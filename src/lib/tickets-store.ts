import { Ticket } from '@/types/ticket';

// In-memory storage (for demo purposes)
let tickets: Ticket[] = [];
let ticketCounter = 0;

// Генерація номера заявки: день + порядковий номер (1501, 1502, etc.)
const generateTicketId = (): string => {
  const today = new Date();
  const day = today.getDate(); // 1-31
  const month = today.getMonth() + 1;
  
  // Формуємо префікс: ММДД (наприклад, 0515 для 15 травня)
  const prefix = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  // Збільшуємо лічильник
  ticketCounter++;
  
  // Формуємо номер: ММДД + порядковий номер (051501, 051502, etc.)
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

  create: (data: Omit<Ticket, 'id' | 'status' | 'created_at' | 'classification'>) => {
    const newTicket: Ticket = {
      ...data,
      id: generateTicketId(),
      status: 'нова',
      created_at: new Date().toISOString(),
      classification: {
        type: '',
        priority: 'низький',
        summary: data.text,
        object: ''
      }
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

  updateClassification: (id: string, classification: Ticket['classification']) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.classification = classification;
      return ticket;
    }
    return null;
  },

  // Для тестування - очистка
  clear: () => {
    tickets = [];
    ticketCounter = 0;
  }
};