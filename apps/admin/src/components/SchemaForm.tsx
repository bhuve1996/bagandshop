'use client';

import { useCallback } from 'react';

interface SchemaFormProps {
  schema: { type?: string; properties?: Record<string, { type?: string; title?: string; enum?: string[]; default?: unknown }> };
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function SchemaForm({ schema, formData, onChange }: SchemaFormProps) {
  const properties = schema?.properties ?? {};
  const handleChange = useCallback(
    (key: string, value: unknown) => {
      onChange({ ...formData, [key]: value });
    },
    [formData, onChange],
  );

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([key, prop]) => {
        const title = (prop as { title?: string }).title ?? key;
        const type = (prop as { type?: string }).type ?? 'string';
        const enumValues = (prop as { enum?: string[] }).enum;
        const value = formData[key];

        return (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            {enumValues ? (
              <select
                className="border rounded px-3 py-2"
                value={String(value ?? '')}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                {enumValues.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : type === 'number' ? (
              <input
                type="number"
                className="border rounded px-3 py-2"
                value={Number(value ?? 0)}
                onChange={(e) => handleChange(key, e.target.value === '' ? 0 : Number(e.target.value))}
              />
            ) : type === 'array' ? (
              <textarea
                className="border rounded px-3 py-2 font-mono text-sm"
                rows={4}
                value={JSON.stringify(value ?? [])}
                onChange={(e) => {
                  try {
                    handleChange(key, JSON.parse(e.target.value || '[]'));
                  } catch {
                    // ignore
                  }
                }}
              />
            ) : (
              <input
                type="text"
                className="border rounded px-3 py-2"
                value={String(value ?? '')}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
