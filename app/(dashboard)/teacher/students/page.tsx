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
import { UserRound, FileBarChart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import useUserStore from "@/store/userStore";
import axios from "axios";
import { Endpoints } from "@/lib/apiEndpoints";

interface Student {
  user_id: string; // Added user_id field
  name: string;
  email_id: string;
  classes: string[];
}
const StudentsPage = () => {
  const token=useUserStore(state=>state.user.token);
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
        "user_id": "6350dfca-e950-4f7b-86a9-a1cab7052f73",
        "name": "Jagdish Butte",
        "email_id": "jagdishbutte@gmail.com",
        "classes": [
            "MCA-2025",
            "MBA-2025",
            "B-Tech - 2026"
        ]
    },
    {
        "user_id": "2c17a66e-7d18-435b-a655-1dfa74ae5c8d",
        "name": "John Dev",
        "email_id": "you@gmail.com",
        "classes": [
            "MCA-2025"
        ]
    }
    ];
    const data=await axios.get(Endpoints.REPORT.GETSTUDENTBYTEACHER,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if(data.status===200){
      setStudents(data.data?.students);
    }else{
      setStudents([]);
    }
    // setStudents([]);
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
          return (
            <div className="flex flex-wrap gap-1">
              {row.original.classes.map((className, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {className}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 border-none"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    router.push(`/teacher/students/${encodeURIComponent(row.original.user_id)}/report`);
                  }}
                >
                  <FileBarChart className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View detailed performance report for {row.original.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
    ],
    [router]
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