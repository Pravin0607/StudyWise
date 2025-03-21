import React, { useState, useMemo, useCallback } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataItem {
    mid: number;
    materialName: string;
    type: string;
    date: string;
    className: string;
}

const MaterialsTable = () => {
    const [data, setData] = useState<DataItem[]>([
        { mid: 1, materialName: 'Material A', type: 'Type X', date: '2024-01-15', className: 'Class 1' },
        { mid: 2, materialName: 'Material B', type: 'Type Y', date: '2024-02-20', className: 'Class 2' },
        { mid: 3, materialName: 'Material C', type: 'Type X', date: '2024-03-10', className: 'Class 1' },
        { mid: 4, materialName: 'Material D', type: 'Type Z', date: '2024-02-01', className: 'Class 3' },
        { mid: 5, materialName: 'Material E', type: 'Type Y', date: '2024-03-25', className: 'Class 2' },
        { mid: 6, materialName: 'Material F', type: 'Type Z', date: '2024-01-28', className: 'Class 3' },
        { mid: 7, materialName: 'Material G', type: 'Type X', date: '2024-02-12', className: 'Class 1' },
        { mid: 8, materialName: 'Material H', type: 'Type Y', date: '2024-03-05', className: 'Class 2' },
        { mid: 9, materialName: 'Material I', type: 'Type Z', date: '2024-01-18', className: 'Class 3' },
        { mid: 10, materialName: 'Material J', type: 'Type X', date: '2024-03-30', className: 'Class 1' },
        { mid: 11, materialName: 'Material K', type: 'Type Y', date: '2024-01-05', className: 'Class 2' },
        { mid: 12, materialName: 'Material L', type: 'Type Z', date: '2024-02-10', className: 'Class 3' },
        { mid: 13, materialName: 'Material M', type: 'Type X', date: '2024-03-18', className: 'Class 1' },
        { mid: 14, materialName: 'Material N', type: 'Type Y', date: '2024-02-22', className: 'Class 2' },
        { mid: 15, materialName: 'Material O', type: 'Type Z', date: '2024-03-01', className: 'Class 3' },
        { mid: 16, materialName: 'Material P', type: 'Type X', date: '2024-01-22', className: 'Class 1' },
        { mid: 17, materialName: 'Material Q', type: 'Type Y', date: '2024-02-17', className: 'Class 2' },
        { mid: 18, materialName: 'Material R', type: 'Type Z', date: '2024-03-12', className: 'Class 3' },
        { mid: 19, materialName: 'Material S', type: 'Type X', date: '2024-01-08', className: 'Class 1' },
        { mid: 20, materialName: 'Material T', type: 'Type Y', date: '2024-03-28', className: 'Class 2' },
    ]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof DataItem; direction: 'ascending' | 'descending' } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowerCaseQuery)
            )
        );
    }, [data, searchQuery]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    if (valueA.toLowerCase() < valueB.toLowerCase()) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (valueA.toLowerCase() > valueB.toLowerCase()) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                } else {
                    if (valueA < valueB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = useCallback((key: keyof DataItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    }, [sortConfig]);

    const getSortIcon = (key: keyof DataItem) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="w-4 h-4" />;
        }
        return sortConfig.direction === 'ascending' ? (
            <ArrowUpDown className="w-4 h-4" />
        ) : (
            <ArrowUpDown className="w-4 h-4" />
        );
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const getPaginationNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

        if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
            startPage = 1;
            endPage = Math.min(totalPages, maxVisiblePages);
        } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
            endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (startPage > 1) {
            pageNumbers.unshift(-1);
        }
        if (endPage < totalPages) {
            pageNumbers.push(-2);
        }
        if (startPage > 2) {
            pageNumbers.unshift(1);
        }
        if (endPage < totalPages - 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="w-full p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="max-w-sm sm:max-w-md mb-4 sm:mb-0 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Items per page:
                    </span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value, 10));
                            setCurrentPage(1);
                        }}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value={sortedData.length}>All</option>
                    </select>
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 shadow-md">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700/50">
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="h-9 px-0 font-semibold text-gray-900 dark:text-gray-100"
                                    onClick={() => requestSort('mid')}
                                >
                                    <span>MID</span>
                                    {getSortIcon('mid')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="h-9 px-0 font-semibold text-gray-900 dark:text-gray-100"
                                    onClick={() => requestSort('materialName')}
                                >
                                    <span>Material Name</span>
                                    {getSortIcon('materialName')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="h-9 px-0 font-semibold text-gray-900 dark:text-gray-100"
                                    onClick={() => requestSort('type')}
                                >
                                    <span>Type</span>
                                    {getSortIcon('type')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="h-9 px-0 font-semibold text-gray-900 dark:text-gray-100"
                                    onClick={() => requestSort('date')}
                                >
                                    <span>Date</span>
                                    {getSortIcon('date')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="h-9 px-0 font-semibold text-gray-900 dark:text-gray-100"
                                    onClick={() => requestSort('className')}
                                >
                                    <span>Class Name</span>
                                    {getSortIcon('className')}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((item) => (
                            <TableRow key={item.mid} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.mid}</TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{item.materialName}</TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{item.type}</TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{item.date}</TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{item.className}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {sortedData.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="px-3 h-8 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="sr-only">Previous Page</span>
                        </Button>
                        {getPaginationNumbers().map((pageNumber, index) => {
                            if (pageNumber === -1) {
                                return (
                                    <span key={`start-ellipsis-${index}`} className="text-gray-500 dark:text-gray-400 mx-1.5">...</span>
                                );
                            }
                            if (pageNumber === -2) {
                                return (
                                    <span key={`end-ellipsis-${index}`} className="text-gray-500 dark:text-gray-400 mx-1.5">...</span>
                                );
                            }
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    className={cn(
                                        "h-8 min-w-[32px] px-2",
                                        currentPage === pageNumber
                                            ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-300"
                                            : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                    onClick={() => paginate(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            className="px-3 h-8 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                            <span className="sr-only">Next Page</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialsTable;
