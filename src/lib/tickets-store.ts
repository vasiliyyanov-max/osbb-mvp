// Временное хранилище в памяти (позже заменим на Supabase)
export interface Ticket {
  id: string;
  text: string;
  apartment: string;
  contact: string;
  classification: {
    type: string;
    priority: string;
    summary: string;
    object: string;
    requires_action: boolean;
  };
  status: 'нова' | 'в_роботі' | 'закрита';
  created_at: string;
}

// In-memory хранилище (сбрасывается при перезапуске сервера)
const tickets: Ticket[] = [];

// ✅ ДОДАНО: Генерація номера заявки: ММДД01, ММДД02, etc.
const generateTicketId = (): string => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // 0-11, тому +1
  
  // Формуємо префікс ММДД (наприклад, 0517 для 17 травня)
  const prefix = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  // Знаходимо кількість заявок сьогодні
  const todayStr = today.toDateString();
  const todayTickets = tickets.filter(t => 
    new Date(t.created_at).toDateString() === todayStr
  );
  
  // Наступний номер = кількість заявок + 1
  const ticketNumber = (todayTickets.length + 1).toString().padStart(2, '0');
  
  return `${prefix}${ticketNumber}`;
};

export const ticketsStore = {
  create: (ticket: Omit<Ticket, 'id' | 'created_at' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: generateTicketId(), // ✅ Використовуємо нову функцію замість REQ-${Date.now()}
      created_at: new Date().toISOString(),
      status: 'нова',
    };
    tickets.unshift(newTicket);
    return newTicket;
  },
  
  getAll: () => {
    return tickets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
  
  updateStatus: (id: string, status: Ticket['status']) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      return ticket;
    }
    return null;
  },
};