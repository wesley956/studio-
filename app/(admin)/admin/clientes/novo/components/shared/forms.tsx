import { ReactNode } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none ${props.className || ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none ${props.className || ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none ${props.className || ''}`} />;
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return <button type="submit" className="rounded-2xl bg-primary px-5 py-3 text-white transition hover:opacity-90">{children}</button>;
}
