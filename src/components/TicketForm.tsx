'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function TicketForm() {
  const [text, setText] = useState('');
  const [apartment, setApartment] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');

  // Функція перевірки на абракадабру
  const isGibberish = (text: string): boolean => {
    const cleanText = text.toLowerCase().trim();
    
    // Занадто короткий текст
    if (cleanText.length < 5) return true;
    
    // Перевірка на надмірну кількість однакових символів поспіль
    const repeatedChars = /(.)\1{4,}/.test(cleanText);
    if (repeatedChars) return true;
    
    // Перевірка на співвідношення голосних/приголосних
    const vowels = 'аеєиіїоуюяaeiouy';
    const consonants = 'бвгґджзжйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz';
    
    let vowelCount = 0;
    let consonantCount = 0;
    
    for (const char of cleanText) {
      if (vowels.includes(char)) vowelCount++;
      else if (consonants.includes(char)) consonantCount++;
    }
    
    // Якщо голосних менше 15% або більше 70% — підозріло
    const totalLetters = vowelCount + consonantCount;
    if (totalLetters > 0) {
      const vowelRatio = vowelCount / totalLetters;
      if (vowelRatio < 0.15 || vowelRatio > 0.70) return true;
    }
    
    // Занадто багато цифр (>60%)
    const digitCount = cleanText.replace(/\D/g, '').length;
    if (digitCount / cleanText.length > 0.6) return true;
    
    // Занадто багато спецсимволів (>40%)
    const specialChars = cleanText.replace(/[а-яa-z0-9\s]/gi, '').length;
    if (specialChars / cleanText.length > 0.4) return true;
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTicketId('');

    // Перевірка на абракадабру
    if (isGibberish(text)) {
      setError('❌ Це не розбірливий текст. Будь ласка, введіть зрозуміле повідомлення українською або російською мовою.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          apartment,
          phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const id = data.id || ticketId || 'N/A';
        setTicketId(id);
        setText('');
        setApartment('');
        setPhone('');
        alert(`✅ Заявку прийнято!\n\nНомер заявки: ${id}\n\nНайближчим часом з вами зв'яжеться спеціаліст.`);
      } else {
        setError('Помилка при відправці заявки. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Помилка при відправці заявки. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">ОСББ Помічник</h1>
          <p className="text-sm text-gray-600 mb-3">адреса: вул. Садова будинок 15</p>
          <p className="text-gray-600">Опишіть проблему — AI допоможе її вирішити</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Що сталося? *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Наприклад: Прорвало трубу в ванній, затопило сусідів..."
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Квартира *
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="45"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Відправка...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Надіслати заявку
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}