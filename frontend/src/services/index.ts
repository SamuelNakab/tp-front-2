export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};

// Placeholder for future API/domain services.
// Keep this layer focused on data access and orchestration.
