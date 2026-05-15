// Типы данных для заявок ОСББ

export interface TicketFormData {
  text: string;
  apartment: string;
  contact: string;
}

export interface TicketResponse {
  success: boolean;
  ticket_id?: string;
  message: string;
  error?: string;
}

export interface AIClassifiedTicket {
  id: string;
  type: 'аварія' | 'поломка' | 'скарга' | 'інфо_запит' | 'пропозиція';
  priority: 'високий' | 'середній' | 'низький';
  summary: string;
  apartment: string | null;
  object: string | null;
  status: 'нова' | 'в_роботі' | 'закрита';
  created_at: string;
}

// Alias для сумісності з tickets-store.ts
  export type Ticket = AIClassifiedTicket;