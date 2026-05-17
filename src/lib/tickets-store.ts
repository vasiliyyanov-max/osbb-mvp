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

export const ticketsStore = {
  create: (ticket: Omit<Ticket, 'id' | 'created_at' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `REQ-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'нова',
    };
    tickets.unshift(newTicket); // Добавляем в начало
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