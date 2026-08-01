export type MapPlaceActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

export const initialMapPlaceActionState: MapPlaceActionState = {
  status: "idle",
};
