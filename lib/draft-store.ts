import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Application, ApplicationReview, ApplicationStatus, UploadMeta, VisaForm } from "@/lib/types";
import { EMPTY_FORM } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

type DraftState = {
  hydrated: boolean;
  id: string | null;
  publicId: string | null;
  status: ApplicationStatus;
  currentStep: number;
  form: VisaForm;
  photo: UploadMeta | null;
  passportScan: UploadMeta | null;
  precheck: ApplicationReview | null;
  saveState: SaveState;
  lastSavedAt: string | null;
  saveError: string | null;
  setForm: <K extends keyof VisaForm>(key: K, value: VisaForm[K]) => void;
  patchForm: (partial: Partial<VisaForm>) => void;
  setStep: (step: number) => void;
  setPhoto: (photo: UploadMeta | null) => void;
  setPassportScan: (scan: UploadMeta | null) => void;
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
  status: "draft" as ApplicationStatus,
  currentStep: 0,
  form: EMPTY_FORM,
  photo: null as UploadMeta | null,
  passportScan: null as UploadMeta | null,
  precheck: null as ApplicationReview | null,
  saveState: "idle" as SaveState,
  lastSavedAt: null as string | null,
  saveError: null as string | null,
};

export const useDraft = create<DraftState>()(
  persist(
    (set) => ({
      ...initial,
      setForm: (key, value) =>
        set((s) => ({ form: { ...s.form, [key]: value }, precheck: null, saveState: "idle" })),
      patchForm: (partial) =>
        set((s) => ({ form: { ...s.form, ...partial }, precheck: null, saveState: "idle" })),
      setStep: (currentStep) => set({ currentStep }),
      setPhoto: (photo) => set({ photo, precheck: null, saveState: "idle" }),
      setPassportScan: (passportScan) => set({ passportScan, precheck: null, saveState: "idle" }),
      hydrateFromServer: (app) =>
        set({
          id: app.id,
          publicId: app.publicId,
          status: app.status,
          currentStep: app.currentStep,
          form: { ...EMPTY_FORM, ...app.form },
          photo: app.photo,
          passportScan: app.passportScan,
          precheck: app.precheck,
          lastSavedAt: app.updatedAt,
          saveState: "saved",
          saveError: null,
        }),
      markSaving: () => set({ saveState: "saving", saveError: null }),
      markSaved: (app) =>
        set({
          id: app.id,
          publicId: app.publicId,
          status: app.status,
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
        status: s.status,
        currentStep: s.currentStep,
        form: s.form,
        photo: s.photo,
        passportScan: s.passportScan,
        precheck: s.precheck,
        lastSavedAt: s.lastSavedAt,
      }),
      onRehydrateStorage: () => (state) => {
        useDraft.setState({
          hydrated: true,
          form: { ...EMPTY_FORM, ...state?.form },
        });
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
  };
}
