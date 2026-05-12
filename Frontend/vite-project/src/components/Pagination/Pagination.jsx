import React from "react";
import '../../styles/components/Pagination.css'

const maxItems = 9;
const maxLeft = (maxItems - 1) / 2;

export default function Pagination({ limit, total, offset, setOffset }) {
  const current = offset ? Math.floor(offset / limit) + 1 : 1;
  const pages = Math.ceil(total / limit);
  const first = Math.min(
    Math.max(current - maxLeft, 1),
    Math.max(pages - maxItems + 1, 1)
  );

  return (
    <ul className="pagination-list">
      <li>
        <button onClick={() => setOffset(0)} disabled={current === 1}>
          {"«"}
        </button>
      </li>
      <li>
        <button
          onClick={() => setOffset((current - 2) * limit)}
          disabled={current === 1}
        >
          {"‹"}
        </button>
      </li>

      {Array.from({ length: Math.min(maxItems, pages) })
        .map((_, index) => index + first)
        .filter((page) => page <= pages)
        .map((page) => (
          <li key={page}>
            <button
              className={page === current ? "active" : ""}
              onClick={() => page !== current && setOffset((page - 1) * limit)}
            >
              {page}
            </button>
          </li>
        ))}

      <li>
        <button
          onClick={() => setOffset(current * limit)}
          disabled={current === pages}
        >
          {"›"}
        </button>
      </li>
      <li>
        <button
          onClick={() => setOffset((pages - 1) * limit)}
          disabled={current === pages}
        >
          {"»"}
        </button>
      </li>
    </ul>
  );
}