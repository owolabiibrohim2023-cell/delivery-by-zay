/**
 * Responsive data table. Renders a proper table on desktop and
 * stacked cards on small screens from the same column definitions.
 *
 * columns: [{ key, label, render?(row), className? }]
 */
export default function DataTable({ columns, rows, keyField = 'id', empty = 'No records found.' }) {
  if (!rows?.length) {
    return <p className="rounded-xl border border-dashed border-ink/15 px-6 py-10 text-center text-[13px] text-ink/45">{empty}</p>;
  }
  return (
    <>
      {/* Desktop table */}
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-ink/10 bg-mist/60">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 font-sans text-[11px] font-semibold text-ink/50 ${c.className || ''}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[keyField]} className="border-b border-ink/5 transition-colors last:border-0 hover:bg-mist/40">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3.5 align-middle ${c.className || ''}`}>
                      {c.render ? c.render(row) : row[c.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row[keyField]} className="card p-4">
            {columns.map((c, i) => (
              <div key={c.key} className={`flex items-start justify-between gap-3 ${i > 0 ? 'mt-2.5' : ''}`}>
                <span className="text-[11px] font-semibold text-ink/45">{c.label}</span>
                <span className={`text-right text-[13px] ${c.className || ''}`}>
                  {c.render ? c.render(row) : row[c.key] ?? '—'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
