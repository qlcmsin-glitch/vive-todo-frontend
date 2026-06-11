import { useCallback, useEffect, useState } from 'react';
import * as todoApi from './api/todos';
import Calendar from './components/Calendar';
import TodoPanel from './components/TodoPanel';
import { toDateKey } from './utils/date';
import './App.css';

function App() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos, setTodos] = useState([]);
  const [datesWithTodos, setDatesWithTodos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedDateKey = toDateKey(selectedDate);

  const loadMonthMarkers = useCallback(async () => {
    try {
      const allTodos = await todoApi.fetchTodos();
      const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
      const dates = new Set(
        allTodos.filter((t) => t.dateKey.startsWith(monthPrefix)).map((t) => t.dateKey)
      );
      setDatesWithTodos(dates);
    } catch {
      setDatesWithTodos(new Set());
    }
  }, [viewYear, viewMonth]);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await todoApi.fetchTodos(selectedDateKey);
      setTodos(data);
    } catch (err) {
      setError(err.message);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDateKey]);

  useEffect(() => {
    loadMonthMarkers();
  }, [loadMonthMarkers]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  };

  const handleAdd = async (text) => {
    setError('');
    try {
      const todo = await todoApi.createTodo({
        text,
        dateKey: selectedDateKey,
        completed: false,
      });
      setTodos((prev) => [...prev, todo]);
      setDatesWithTodos((prev) => new Set([...prev, selectedDateKey]));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleToggle = async (todo) => {
    setError('');
    try {
      const updated = await todoApi.updateTodo(todo._id, {
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, data) => {
    setError('');
    try {
      const updated = await todoApi.updateTodo(id, data);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await todoApi.deleteTodo(id);
      const nextTodos = todos.filter((t) => t._id !== id);
      setTodos(nextTodos);
      if (nextTodos.length === 0) {
        setDatesWithTodos((prev) => {
          const next = new Set(prev);
          next.delete(selectedDateKey);
          return next;
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">할일 달력</h1>
        <p className="app__subtitle">날짜를 선택하고 할일을 관리하세요</p>
      </header>

      <main className="app__main">
        <Calendar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          today={today}
          datesWithTodos={datesWithTodos}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <TodoPanel
          selectedDate={selectedDate}
          todos={todos}
          loading={loading}
          error={error}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
