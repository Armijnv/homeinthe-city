export type MapPlaceActionState = {
  status: "idle" | "error";
  message?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

export const initialMapPlaceActionState: MapPlaceActionState = {
  status: "idle",
};
