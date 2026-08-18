"use client";

import { useState, type ChangeEvent } from "react";
import { dashboardFileInputClass, prepareDashboardImageInput, selectedDashboardImageError } from "@/app/lib/dashboardImageSelection";

export function ProfilePhotoInput() {
  const [error, setError] = useState("");
  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const { files, error: preparationError } = await prepareDashboardImageInput(input, "Profile photo");
    const validationError = preparationError || (files[0] ? selectedDashboardImageError(files[0], "Profile photo") : "");
    input.setCustomValidity(validationError);
    setError(validationError);
  }
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-widest text-stone-400">Profile photo</span><input name="profile-photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif" className={dashboardFileInputClass} data-dashboard-image onChange={onChange} />{error ? <span className="mt-2 block text-sm text-red-200">{error}</span> : null}</label>;
}
