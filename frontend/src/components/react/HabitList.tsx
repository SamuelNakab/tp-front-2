import { useState } from "react";

type Habit = {
  id: number;
  name: string;
  completed: boolean;
};

const initialHabits: Habit[] = [
  { id: 1, name: "Read 20 minutes", completed: false },
  { id: 2, name: "Drink water", completed: true },
  { id: 3, name: "Walk 5,000 steps", completed: false },
];

export default function HabitList() {
  const [habits, setHabits] = useState(initialHabits);

  function toggleHabit(id: number) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }

  return (
    <section>
      <h2>Today&apos;s habits</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: "0.6rem" }}>
        {habits.map((habit) => (
          <li
            key={habit.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "0.5rem",
              padding: "0.75rem",
            }}
          >
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id)}
            />
            <span style={{ color: habit.completed ? "#94a3b8" : "#e2e8f0" }}>{habit.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
