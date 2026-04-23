import { ReactNode } from 'react';

export function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary ${props.className || ''}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary ${props.className || ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary ${props.className || ''}`}
    />
  );
}

export function SubmitButton({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={`rounded-2xl bg-primary px-5 py-3 text-white transition hover:opacity-90 ${className || ''}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-2xl border border-border bg-white px-4 py-3 text-sm transition hover:bg-primary-soft ${className || ''}`}
    >
      {children}
    </button>
  );
}
