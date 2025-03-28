"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";

interface Student {
  user_id: string; // Added user_id field
  name: string;
  email_id: string;
  classes: string[];
}
const StudentsPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    // Mock data for students
    const mockData: Student[] = [
      {
        user_id: "usr_001", // Added user_id
        name: "Pravin Adhav",
        email_id: "pravin@example.com",
        classes: ["MCA", "MBA"],
      },
      {
        user_id: "usr_002", // Added user_id
        name: "Shyam Adhav",
        email_id: "shyam@example.com",
        classes: ["BCA"],
      },
    ];
    // setStudents(mockData);
    setStudents([]);
  };

  const columns: ColumnDef<Student>[] = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email_id",
        header: "Email",
      },
      {
        accessorKey: "classes",
        header: "Classes",
        cell: ({ row }) => {
          return <div>{row.original.classes.join(", ")}</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      <Input
        type="text"
        placeholder="Search students..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md shadow-sm focus:ring-2 border-green-400 focus:ring-blue-500 focus:border-blue-500 text-lg"
      />

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <UserRound size={48} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Students Found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            There are no students registered yet. New students will appear here once they're added to the system.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add New Student
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="bg-white rounded-md shadow-sm w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="font-bold"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className:
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef
                                  .header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() ===
                                "asc" ? (
                                " ▲"
                              ) : header.column.getIsSorted() ===
                                "desc" ? (
                                " ▼"
                              ) : null}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => router.push(`/teacher/students/${encodeURIComponent(row.original.user_id)}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getRowModel().rows.length} of{" "}
              {students.length} row(s)
            </div>
            <div className="space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentsPage;
