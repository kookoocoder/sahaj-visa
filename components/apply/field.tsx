import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react";
import { FieldHelp } from "@/components/apply/field-help";
import { FORMAT_SPECS, type InputFormatId } from "@/lib/input-format";
import { cn } from "@/lib/utils";

export const SavePulseContext = createContext<string | null>(null);

export const controlClass = "ux4g-input-input";

function WhyAsk({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ux4g-mt-xs">
      <button
        type="button"
        className="ux4g-btn ux4g-btn-text-primary ux4g-btn-sm"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Why we ask this
      </button>
      {open ? <p className="ux4g-body-xs-default ux4g-mt-xs">{text}</p> : null}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  helpField,
  why,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  helpField?: string;
  why?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const pulsed = useContext(SavePulseContext);
  const justSaved = Boolean(htmlFor && pulsed === htmlFor);
  return (
    <div className={cn("ux4g-input-container ux4g-input-md", error && "ux4g-input-error")}>
      <div className="ux4g-d-flex ux4g-jc-between ux4g-ai-center">
        <label htmlFor={htmlFor} className="ux4g-label-m-default">
          {label}
          {required ? <span className="ux4g-text-error"> *</span> : null}
          {justSaved ? (
            <span className="saved-pulse ux4g-body-xs-default ux4g-text-primary" aria-live="polite">
              {" "}
              Saved
            </span>
          ) : null}
        </label>
        {helpField ? <FieldHelp field={helpField} /> : null}
      </div>
      <div className="ux4g-input">{children}</div>
      {error ? (
        <div className="ux4g-input-helper" role="alert">
          <span className="ux4g-icon-outlined ux4g-input-helper-icon">error</span>
          <span className="ux4g-input-helper-text">{error}</span>
        </div>
      ) : hint ? (
        <div className="ux4g-input-helper">
          <span className="ux4g-icon-outlined ux4g-input-helper-icon">info</span>
          <span className="ux4g-input-helper-text">{hint}</span>
        </div>
      ) : null}
      {why ? <WhyAsk text={why} /> : null}
    </div>
  );
}

export function TextInput({
  id,
  error,
  className,
  format,
  onChange,
  maxLength,
  inputMode,
  autoCapitalize,
  spellCheck,
  placeholder,
  pattern,
  ...props
}: ComponentProps<"input"> & { error?: string; format?: InputFormatId }) {
  const spec = format ? FORMAT_SPECS[format] : undefined;
  return (
    <input
      {...props}
      id={id}
      className={cn(controlClass, className)}
      aria-invalid={error ? true : undefined}
      maxLength={maxLength ?? spec?.inputMaxLength ?? spec?.maxLength}
      inputMode={inputMode ?? spec?.inputMode}
      autoCapitalize={autoCapitalize ?? spec?.autoCapitalize}
      spellCheck={spellCheck ?? spec?.spellCheck}
      placeholder={placeholder ?? spec?.placeholder}
      pattern={pattern ?? spec?.htmlPattern}
      onChange={(e) => {
        if (spec) {
          const sanitized = spec.sanitize(e.target.value);
          if (sanitized !== e.target.value) e.target.value = sanitized;
        }
        onChange?.(e);
      }}
    />
  );
}

export function SelectInput({
  id,
  error,
  children,
  ...props
}: ComponentProps<"select"> & { error?: string }) {
  return (
    <select
      id={id}
      className={cn(controlClass, "sahaj-input-select")}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function TextArea({
  id,
  error,
  format,
  onChange,
  maxLength,
  ...props
}: ComponentProps<"textarea"> & { error?: string; format?: InputFormatId }) {
  const spec = format ? FORMAT_SPECS[format] : undefined;
  return (
    <textarea
      {...props}
      id={id}
      className={cn("ux4g-textarea-input", "sahaj-input-textarea")}
      aria-invalid={error ? true : undefined}
      maxLength={maxLength ?? spec?.maxLength}
      onChange={(e) => {
        if (spec) {
          const sanitized = spec.sanitize(e.target.value);
          if (sanitized !== e.target.value) e.target.value = sanitized;
        }
        onChange?.(e);
      }}
    />
  );
}
