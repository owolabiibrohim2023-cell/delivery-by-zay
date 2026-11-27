import { AlertCircle } from 'lucide-react';

export function Field({ label, error, hint, children, required = false }) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="ml-1 text-brand-deep">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-[12px] text-ink/45">{hint}</span>}
      {error && (
        <span className="field-error inline-flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </span>
      )}
    </label>
  );
}

export function TextInput({ invalid, ...props }) {
  return (
    <input
      className={`field ${invalid ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
      {...props}
    />
  );
}

export function Select({ invalid, options = [], placeholder, children, ...props }) {
  return (
    <select
      className={`field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23080808%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10 ${invalid ? 'border-red-400' : ''}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
      {children}
    </select>
  );
}

export function Textarea({ invalid, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`field resize-y ${invalid ? 'border-red-400' : ''}`}
      {...props}
    />
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="inline-flex cursor-pointer items-start gap-2.5 text-[13px] text-ink/70">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-ink/25 accent-brand"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
