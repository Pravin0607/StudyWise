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
import { Download, Trash2, FileUp, FileText } from "lucide-react";
import { useMaterialStore } from "@/store/useMaterialStore";
import useUserStore from "@/store/userStore";
import { deleteMaterial, downloadMaterial, getMaterialsByTeacher } from "@/services/materialsServices";

interface Material {
    material_id: string;
    file_name: string;
    uploaded_date: string;
    class_name: string;
}

const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [sorting, setSorting] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 9,
    });
    const token = useUserStore((state) => state.user.token);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        // const mockData: Material[] = [
        //     {
        //         material_id: "a724bd8a-6c61-4cd3-bf8d-0eaedbb0fc49",
        //         file_name: "shyam_Santosh_Adhav_Resume.pdf",
        //         uploaded_date: "2025-03-28T11:28:19.593Z",
        //         class_name: "MCA",
        //     },
        //     {
        //         material_id: "a724bd8a-6c6-4cd3-bf8d-0eaedbb0fc49",
        //         file_name: "zravin_Santosh_Adhav_Resume.pdf",
        //         uploaded_date: "2025-03-28T11:28:19.593Z",
        //         class_name: "MCA",
        //     },
        // ];
        // setMaterials(mockData);
        const materials:any=await getMaterialsByTeacher(token as string);
        if (materials) {
            setMaterials(materials);
        } else {
            setMaterials([]);
        }
        // setMaterials(materials);
    };
    
    const handleDownload = async (materialId: string) => {
        try {
            const downloadUrl = await downloadMaterial(materialId, token as string);
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to download material:', error);
        }
    };

    const columns: ColumnDef<Material>[] = useMemo(
        () => [
            {
                id: "index",
                header: "#",
                cell: ({ row }) => {
                    return <div>{row.index + 1}</div>;
                },
            },
            {
                accessorKey: "file_name",
                header: "Filename",
            },
            {
                accessorKey: "class_name",
                header: "Class",
            },
            {
                accessorKey: "uploaded_date",
                header: "Date",
                cell: ({ row }) => {
                    const date = new Date(row.original.uploaded_date);
                    return <div>{date.toLocaleDateString()}</div>; // Formats to local date string
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleDownload(row.original.material_id)}
                        >
                            <Download className="h-4 w-4" />
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
                                        permanently delete the material from our
                                        servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={async() => {
                                            await deleteMaterial(row.original.material_id, token as string);
                                            window.location.reload();
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
        data: materials,
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
            <h1 className="text-2xl font-bold mb-4">Materials</h1>

            <Input
                type="text"
                placeholder="Search materials..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mb-4 w-full max-w-md rounded-md shadow-sm focus:ring-2 border-green-400 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />

            {materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
                        <FileText size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Materials Available</h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                        You haven't uploaded any study materials yet. Upload documents, presentations or other resources for your students.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <FileUp className="mr-2 h-4 w-4" /> Upload New Material
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
                            {materials.length} row(s)
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

export default MaterialsPage;
