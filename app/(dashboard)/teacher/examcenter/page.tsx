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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, ClipboardList, PlusCircle } from "lucide-react";

interface Exam {
  exam_id: string;
  title: string;
  questions: number;
  marks: number;
  date: string;
  "start-time": string;
  "end-time": string;
}

const ExamCenterPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    // Mock data for exams
    const mockData: Exam[] = [
      {
        exam_id: "1",
        title: "Midterm Exam",
        questions: 50,
        marks: 100,
        date: "2025-04-05",
        "start-time": "09:00",
        "end-time": "11:00",
      },
      {
        exam_id: "2",
        title: "Final Exam",
        questions: 100,
        marks: 200,
        date: "2025-05-15",
        "start-time": "14:00",
        "end-time": "17:00",
      },
    ];
    // setExams(mockData);
    setExams([]);
    
  };

  const columns: ColumnDef<Exam>[] = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "questions",
        header: "Questions",
      },
      {
        accessorKey: "marks",
        header: "Marks",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "start-time",
        header: "Start Time",
      },
      {
        accessorKey: "end-time",
        header: "End Time",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="secondary" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will
                    permanently delete the exam from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      alert("delete");
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: exams,
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
      <h1 className="text-2xl font-bold mb-4">Exam Center</h1>

      <Input
        type="text"
        placeholder="Search exams..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md shadow-sm focus:ring-2 border-green-400 focus:ring-blue-500 focus:border-blue-500 text-lg"
      />

      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-24 w-24 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <ClipboardList size={48} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exams Scheduled</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            You haven't created any exams yet. Create your first exam to set up questions, timing, and other details.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Exam
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
                  <TableRow key={row.id} className="cursor-pointer hover:bg-gray-100">
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
              {exams.length} row(s)
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

export default ExamCenterPage;
