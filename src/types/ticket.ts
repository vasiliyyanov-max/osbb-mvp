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

// ✅ Оновлений інтерфейс з полями для вхідних даних
export interface AIClassifiedTicket {
  id: string;
  // Вхідні дані від користувача
  text: string;           // ✅ Повний текст заявки
  phone?: string;         // ✅ Телефон (опціонально)
  apartment: string;      // ✅ Номер квартири
  
  // Результати AI-класифікації
  type: 'аварія' | 'поломка' | 'скарга' | 'інфо_запит' | 'пропозиція';
  priority: 'високий' | 'середній' | 'низький';
  summary: string;        // ✅ Короткий опис від AI
  object: string | null;  // ✅ Об'єкт від AI
  
  // Системні поля
  status: 'нова' | 'в_роботі' | 'закрита';
  created_at: string;
}

// ✅ Alias для сумісності з tickets-store.ts
export type Ticket = AIClassifiedTicket;