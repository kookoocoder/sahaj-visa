import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AiReview, Application, UploadMeta, VisaForm } from "@/lib/types";
import { EMPTY_FORM } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

type DraftState = {
  hydrated: boolean;
  id: string | null;
  publicId: string | null;
  currentStep: number;
  form: VisaForm;
  photo: UploadMeta | null;
  passportScan: UploadMeta | null;
  aiReview: AiReview | null;
  saveState: SaveState;
  lastSavedAt: string | null;
  saveError: string | null;
  setForm: <K extends keyof VisaForm>(key: K, value: VisaForm[K]) => void;
  setStep: (step: number) => void;
  setPhoto: (photo: UploadMeta | null) => void;
  setPassportScan: (scan: UploadMeta | null) => void;
  setAiReview: (review: AiReview | null) => void;
  hydrateFromServer: (app: Application) => void;
  markSaving: () => void;
  markSaved: (app: Application) => void;
  markError: (message: string) => void;
  reset: () => void;
};

const initial = {
  hydrated: false,
  id: null as string | null,
  publicId: null as string | null,
  currentStep: 0,
  form: EMPTY_FORM,
  photo: null as UploadMeta | null,
  passportScan: null as UploadMeta | null,
  aiReview: null as AiReview | null,
  saveState: "idle" as SaveState,
  lastSavedAt: null as string | null,
  saveError: null as string | null,
};

export const useDraft = create<DraftState>()(
  persist(
    (set) => ({
      ...initial,
      setForm: (key, value) =>
        set((s) => ({ form: { ...s.form, [key]: value }, saveState: "idle" })),
      setStep: (currentStep) => set({ currentStep }),
      setPhoto: (photo) => set({ photo, saveState: "idle" }),
      setPassportScan: (passportScan) => set({ passportScan, saveState: "idle" }),
      setAiReview: (aiReview) => set({ aiReview }),
      hydrateFromServer: (app) =>
        set({
          id: app.id,
          publicId: app.publicId,
          currentStep: app.currentStep,
          form: app.form,
          photo: app.photo,
          passportScan: app.passportScan,
          aiReview: app.aiReview,
          lastSavedAt: app.updatedAt,
          saveState: "saved",
          saveError: null,
        }),
      markSaving: () => set({ saveState: "saving", saveError: null }),
      markSaved: (app) =>
        set({
          id: app.id,
          publicId: app.publicId,
          lastSavedAt: app.updatedAt,
          saveState: "saved",
          saveError: null,
        }),
      markError: (saveError) => set({ saveState: "error", saveError }),
      reset: () => set(initial),
    }),
    {
      name: "sahaj-visa-draft",
      partialize: (s) => ({
        id: s.id,
        publicId: s.publicId,
        currentStep: s.currentStep,
        form: s.form,
        photo: s.photo,
        passportScan: s.passportScan,
        aiReview: s.aiReview,
        lastSavedAt: s.lastSavedAt,
      }),
      onRehydrateStorage: () => () => {
        useDraft.setState({ hydrated: true });
      },
    },
  ),
);

export function draftToPayload() {
  const s = useDraft.getState();
  return {
    id: s.id ?? undefined,
    currentStep: s.currentStep,
    form: s.form,
    photo: s.photo,
    passportScan: s.passportScan,
    aiReview: s.aiReview,
  };
}
