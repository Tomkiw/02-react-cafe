import css from './App.module.css'; // Імпорт стилів як об'єкта (CSS Modules). Використовується як css.className
import CafeInfo from '../CafeInfo/CafeInfo'; // Імпорт React-компонента (Function Component)
import type { Votes, VoteType } from '../../types/votes'; // Імпорт типів TypeScript для типізації стану та пропсів
import VoteOptions from '../VoteOptions/VoteOptions'; // Імпорт компонента з кнопками голосування
import { useState } from 'react'; // Імпорт хука useState з бібліотеки React для роботи зі станом
import VoteStats from '../VoteStats/VoteStats'; // Імпорт компонента для відображення статистики
import Notification from '../Notification/Notification'; // Імпорт компонента-повідомлення

export default function App() {
  // useState - це хук, який створює "стан" (state) компонента.
  // <Votes> - це Generic (узагальнення) TypeScript, який каже, що наш стан буде виглядати як інтерфейс Votes.
  // votes - змінна, що зберігає поточне значення стану (об'єкт { good: 0, ... }).
  // setVotes - функція, яку ми викликаємо, щоб змінити цей стан і змусити React перемалювати компонент.
  const [votes, setVotes] = useState<Votes>({ good: 0, neutral: 0, bad: 0 });

  // Функція-обробник події (Event Handler).
  // type: VoteType - типізація аргументу, приймає лише рядки 'good', 'neutral' або 'bad'.
  function handleVote(type: VoteType) {
    setVotes({
      ...votes, // Spread-оператор: копіюємо всі попередні значення об'єкта (щоб не стерти інші лічильники)
      [type]: votes[type] + 1, // Computed property name: динамічно оновлюємо ключ, який відповідає значенню type
    });
  }

  // Функція для скидання стану до початкових значень.
  function resetVotes() {
    setVotes({ good: 0, neutral: 0, bad: 0 }); // Передаємо новий об'єкт з нулями
  }

  // Обчислювані значення (Derived State).
  // Вони перераховуються автоматично при кожному рендері, коли змінюється стан votes.
  const totalVotes = votes.good + votes.neutral + votes.bad; // Загальна сума
  const positiveRate = totalVotes
    ? Math.round((votes.good / totalVotes) * 100)
    : 0;

  return (
    <div className={css.app}>
      <CafeInfo />
      {/* Передача пропсів (Props) у дочірній компонент.
          Ми передаємо функції (handleVote, resetVotes) та дані (totalVotes > 0) вниз. */}
      <VoteOptions
        onVote={handleVote}
        onReset={resetVotes}
        canReset={totalVotes > 0}
      />
      {/* Умовний рендеринг (Conditional Rendering).
          Тернарний оператор: якщо totalVotes > 0, показуємо статистику, інакше - повідомлення */}
      {totalVotes > 0 ? (
        <VoteStats
          votes={votes}
          totalVotes={totalVotes}
          positiveRate={positiveRate}
        />
      ) : (
        <Notification />
      )}
    </div>
  );
}
