'use client';

import { useState } from 'react';

export default function TicketForm() {
  const [text, setText] = useState('');
  const [apartment, setApartment] = useState('');
  const [contact, setContact] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim().length < 5) {
      setStatus('error');
      setErrorMessage('Опишіть проблему детальніше (мінімум 5 символів)');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, apartment, contact }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Помилка відправки');
      }

      setStatus('success');
      setText('');
      setApartment('');
      setContact('');
      
      // Сброс статуса через 3 секунды
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Не вдалося надіслати заявку');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ОСББ Помічник</h1>
          <p className="text-gray-500 text-sm mt-2">
            Опишіть проблему, AI автоматично її обробить
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Що сталося? *
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Наприклад: Ліфт не працює..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Квартира
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="45"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+380..."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={status === 'loading'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
              status === 'loading' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === 'loading' ? 'AI обробляє...' : 'Надіслати заявку'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm text-center">
            ✅ Заявку прийнято! Голова ОСББ вже бачить її.
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm text-center">
            ❌ {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}