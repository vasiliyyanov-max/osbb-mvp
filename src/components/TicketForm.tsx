'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function TicketForm() {
  const [text, setText] = useState('');
  const [apartment, setApartment] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Перевірка на абракадабру
  const isGibberish = (text: string): boolean => {
    const cleanText = text.toLowerCase().trim();
    
    // Занадто короткий текст
    if (cleanText.length < 5) return true;
    
    // Перевірка на надмірну кількість однакових символів
    const repeatedChars = /(.)\1{4,}/.test(cleanText);
    if (repeatedChars) return true;
    
    // Перевірка голосних/приголосних
    const vowels = 'аеєиіїоуюяaeiouy';
    let vowelCount = 0;
    let consonantCount = 0;
    
    for (const char of cleanText) {
      if (vowels.includes(char)) vowelCount++;
      else if (/[бвгґджзжйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz]/.test(char)) {
        consonantCount++;
      }
    }
    
    const totalLetters = vowelCount + consonantCount;
    if (totalLetters > 0) {
      const vowelRatio = vowelCount / totalLetters;
      if (vowelRatio < 0.15 || vowelRatio > 0.70) return true;
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');



  // Перевірка на абракадабру
  const isGibberish = (text: string): boolean => {
    const cleanText = text.toLowerCase().trim();
    
    // 1. Занадто короткий текст (менше 10 символів)
    if (cleanText.length < 10) {
      console.log('❌ Занадто короткий');
      return true;
    }
    
    // 2. Перевірка на надмірну кількість однакових символів поспіль
    const repeatedChars = /(.)\1{3,}/.test(cleanText);
    if (repeatedChars) {
      console.log('❌ Багато однакових символів');
      return true;
    }
    
    // 3. Перевірка співвідношення голосних/приголосних
    const vowels = 'аеєиіїоуюяaeiouyаеёиоуыэюя';
    const consonants = 'бвгґджзжйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz';
    
    let vowelCount = 0;
    let consonantCount = 0;
    let otherCount = 0;
    
    for (const char of cleanText) {
      if (vowels.includes(char)) vowelCount++;
      else if (consonants.includes(char)) consonantCount++;
      else otherCount++;
    }
    
    const totalLetters = vowelCount + consonantCount;
    
    // Якщо більше 40% цифр або спецсимволів — це абракадабра
    if (totalLetters > 0 && otherCount / cleanText.length > 0.4) {
      console.log('❌ Багато цифр/символів');
      return true;
    }
    
    // Перевірка співвідношення голосних/приголосних
    if (totalLetters > 0) {
      const vowelRatio = vowelCount / totalLetters;
      // Нормальне співвідношення: 30-50% голосних
      if (vowelRatio < 0.20 || vowelRatio > 0.60) {
        console.log('❌ Неправильне співвідношення голосних');
        return true;
      }
    }
    
    // 4. Перевірка на випадковий набір слів (менше 3 слів)
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) {
      console.log('❌ Замало слів');
      return true;
    }
    
    // 5. Перевірка на повторюваність слів
    const uniqueWords = new Set(words);
    if (words.length > 5 && uniqueWords.size / words.length < 0.3) {
      console.log('❌ Багато повторень');
      return true;
    }
    
    console.log('✅ Текст валідний');
    return false;
  };





    setLoading(true);

    try {
      const res = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, apartment, phone }),
      });

      if (res.ok) {
        setText('');
        setApartment('');
        setPhone('');
        alert('✅ Заявку прийнято!\n\nНайближчим часом з вами зв\'яжеться спеціаліст.');
      } else {
        setError('Помилка при відправці заявки.');
      }
    } catch (error) {
      setError('Помилка при відправці заявки.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ОСББ Помічник</h1>
          <p className="text-gray-600">Опишіть проблему, AI автоматично її обробить</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Що сталося? *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Наприклад: Ліфт не працює..."
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Квартира
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="45"
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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