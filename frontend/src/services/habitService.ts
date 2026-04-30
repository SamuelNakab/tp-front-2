import { supabase } from "./supabaseClient";

export type Habit = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  user_id: string;
};

type HabitInput = {
  name: string;
  description: string;
  user_id: string;
};

type HabitUpdateInput = {
  name?: string;
  description?: string;
  completed?: boolean;
};

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  return supabase;
}

export async function getHabits(userId: string) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("habits")
    .select("id, name, description, completed, user_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Habit[];
}

export async function createHabit(input: HabitInput) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("habits")
    .insert({
      name: input.name,
      description: input.description,
      completed: false,
      user_id: input.user_id,
    })
    .select("id, name, description, completed, user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit;
}

export async function updateHabit(habitId: string, userId: string, input: HabitUpdateInput) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("habits")
    .update(input)
    .eq("id", habitId)
    .eq("user_id", userId)
    .select("id, name, description, completed, user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit;
}

export async function toggleCompleted(habitId: string, userId: string, completed: boolean) {
  return updateHabit(habitId, userId, { completed: !completed });
}
