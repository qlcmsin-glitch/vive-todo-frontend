import { useState } from 'react';
import { formatSelectedLabel } from '../utils/date';

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const startEdit = () => {
    setEditText(todo.text);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    setEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    await onUpdate(todo._id, { text: trimmed });
    setEditing(false);
  };

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--done' : ''}`}>
      {editing ? (
        <div className="todo-item__edit">
          <input
            className="todo-item__input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <div className="todo-item__actions">
            <button type="button" className="btn btn--primary btn--sm" onClick={saveEdit}>
              저장
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={cancelEdit}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="todo-item__label">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
            />
            <span className="todo-item__text">{todo.text}</span>
          </label>
          <div className="todo-item__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={startEdit}>
              수정
            </button>
            <button type="button" className="btn btn--danger btn--sm" onClick={() => onDelete(todo._id)}>
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default function TodoPanel({
  selectedDate,
  todos,
  loading,
  error,
  onAdd,
  onToggle,
  onUpdate,
  onDelete,
}) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="todo-panel">
      <header className="todo-panel__header">
        <div>
          <h2 className="todo-panel__title">{formatSelectedLabel(selectedDate)}</h2>
          <p className="todo-panel__meta">
            {todos.length === 0
              ? '등록된 할일이 없습니다.'
              : `${completedCount}/${todos.length} 완료`}
          </p>
        </div>
      </header>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-form__input"
          type="text"
          placeholder="할일을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" className="btn btn--primary" disabled={submitting || !text.trim()}>
          추가
        </button>
      </form>

      {error && <p className="message message--error">{error}</p>}

      {loading ? (
        <p className="message">불러오는 중...</p>
      ) : todos.length === 0 ? (
        <p className="message message--empty">이 날짜에 할일을 추가해 보세요.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
