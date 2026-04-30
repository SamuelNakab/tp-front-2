import { useEffect, useState, type FormEvent } from "react";
import HabitCard from "./HabitCard";
import {
  createHabit,
  getHabits,
  toggleCompleted,
  updateHabit,
  type Habit,
} from "../../services/habitService";

type HabitListProps = {
  userId: string;
};

export default function HabitList({ userId }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadHabits() {
      try {
        setLoading(true);
        const fetchedHabits = await getHabits(userId);
        setHabits(fetchedHabits);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load habits.");
      } finally {
        setLoading(false);
      }
    }

    loadHabits();
  }, [userId]);

  async function handleCreateHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const newHabit = await createHabit({
        name,
        description,
        user_id: userId,
      });
      setHabits((prev) => [newHabit, ...prev]);
      setName("");
      setDescription("");
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create habit.");
    }
  }

  async function handleToggle(habit: Habit) {
    try {
      const updatedHabit = await toggleCompleted(habit.id, userId, habit.completed);
      setHabits((prev) => prev.map((item) => (item.id === habit.id ? updatedHabit : item)));
      setError(null);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Unable to update habit.");
    }
  }

  async function handleSaveEdit(habit: Habit, values: { name: string; description: string }) {
    try {
      const updatedHabit = await updateHabit(habit.id, userId, {
        name: values.name,
        description: values.description,
      });
      setHabits((prev) => prev.map((item) => (item.id === habit.id ? updatedHabit : item)));
      setError(null);
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : "Unable to edit habit.");
    }
  }

  return (
    <section>
      <h2>Habits</h2>
      <form onSubmit={handleCreateHabit} style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Habit name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <textarea
          placeholder="Habit description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          required
        />
        <button type="submit">Create habit</button>
      </form>
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      {loading ? (
        <p>Loading habits...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onSaveEdit={handleSaveEdit}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
