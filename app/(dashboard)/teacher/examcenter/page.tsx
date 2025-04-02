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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { Endpoints } from "@/lib/apiEndpoints";
import axios from "axios";
import useUserStore from "@/store/userStore";
import Link from "next/link";
import toast from "react-hot-toast";

interface Exam {
  exam_id: string;
  title: string;
  class_name: string;
  date: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  questions_count: number;
}

const ExamCenterPage = () => {
  const token=useUserStore(state=>state.user.token);
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

  const handleDeleteExam = async (examId: string) => {
          // Implement delete logic here
          try{
              const resp=await axios.delete(Endpoints.CLASS.DELETEEXAM.replace(':examId', examId),{
                  headers:{
                      Authorization:`Bearer ${token}`,
                  }
              });
              if(resp.status===200){
                  toast.success('Exam deleted successfully');
                  await fetchExams();
              }
          }catch(err)
          {
              console.error('Failed to delete exam:', err);
              toast.error('Failed to delete exam');
          }
      };

  const fetchExams = async () => {
    try{
      const result=await axios.get(Endpoints.EXAM.EXAMLIST,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(result.status===200){
        const transformed=result.data.exams.map((exam: Exam) => {
          return ({
            ...exam,
            date: new Date(exam.date).toLocaleDateString(),
          })
        });
        // console.log(result.data.exams);

        setExams(transformed as Exam[]);
      }else{
        setExams([]);
      }

    }catch(err){
      console.error("Error fetching exams:", err);
    }
    // Mock data for exams
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
              accessorKey: "questions_count",
              header: "Questions",
          },
          {
              accessorKey: "total_marks",
              header: "Marks",
          },
          {
              accessorKey: "date",
              header: "Date",
          },
          {
              accessorKey: "start_time",
              header: "Start Time",
          },
          {
              accessorKey: "end_time",
              header: "End Time",
          },
          {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/teacher/exams/${row.original.exam_id}/edit`}>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/teacher/examcenter/result/${row.original.exam_id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Score</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              the exam from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await handleDeleteExam(row.original.exam_id);
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
