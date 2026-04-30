import { useState, type FormEvent } from "react";
import type { Habit } from "../../services/habitService";

type HabitCardProps = {
  habit: Habit;
  onToggle: (habit: Habit) => Promise<void>;
  onSaveEdit: (habit: Habit, values: { name: string; description: string }) => Promise<void>;
};

export default function HabitCard({ habit, onToggle, onSaveEdit }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSaveEdit(habit, { name, description });
    setIsEditing(false);
  }

  return (
    <li
      style={{
        border: "1px solid #1e293b",
        borderRadius: "0.5rem",
        padding: "0.85rem",
        background: "#0f172a",
      }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
            required
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => onToggle(habit)}
            />
            <strong style={{ color: habit.completed ? "#94a3b8" : "#e2e8f0" }}>{habit.name}</strong>
          </div>
          <p style={{ margin: "0.5rem 0", color: "#cbd5e1" }}>{habit.description}</p>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
    </li>
  );
}
