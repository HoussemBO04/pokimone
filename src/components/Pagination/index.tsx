"use client";

import Link from "next/link";

interface PaginationProps {
    total: number;      // total items (data.count)
    perPage?: number;   // default 20
    current: number;    // current page (offset)
}

const Pagination = ({ total, perPage = 20, current }: PaginationProps) => {
    const totalPages = Math.ceil(total / perPage);

    // Show a limited range (e.g. ±2 pages around current)
    const visiblePages = () => {
        const range: number[] = [];
        const start = Math.max(0, current - 2);
        const end = Math.min(totalPages - 1, current + 2);
        for (let i = start; i <= end; i++) range.push(i);
        return range;
    };

    return (
        <nav className="te-Pagination">
            {current > 0 && (
                <Link
                    href={`/?offset=${current - 1}`}
                    className="te-Pagination-button te-Pagination-button--prev"
                >
                    « Prev
                </Link>
            )}

            {visiblePages().map((page) => (
                <Link
                    key={page}
                    href={`/?offset=${page}`}
                    className={`te-Pagination-button ${
                        page === current ? "te-Pagination-button--active" : ""
                    }`}
                >
                    {page + 1}
                </Link>
            ))}

            {current < totalPages - 1 && (
                <Link
                    href={`/?offset=${current + 1}`}
                    className="te-Pagination-button te-Pagination-button--next"
                >
                    Next »
                </Link>
            )}
        </nav>
    );
};

export default Pagination;
