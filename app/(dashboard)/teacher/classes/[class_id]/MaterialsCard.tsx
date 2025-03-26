'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { File, PlusIcon, Trash } from 'lucide-react';
import AddMaterialModal from './AddMaterialModal';
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

interface Material {
    id: string;
    title: string;
    type: string;
}

interface MaterialsCardProps {
    materials: Material[];
    textColor: string;
    cardBgColor: string;
    cardBorderColor: string;
    separatorColor: string;
    itemBgColor: string;
    itemBorderColor: string;
}

export function MaterialsCard({
    materials,
    textColor,
    cardBgColor,
    cardBorderColor,
    separatorColor,
    itemBgColor,
    itemBorderColor
}: MaterialsCardProps) {
    const handleDeleteMaterial = async (materialId: string) => {
        // Implement delete logic here
        console.log(`Deleting material with ID: ${materialId}`);
    };

    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Materials</CardTitle>
                    <AddMaterialModal>
                    <Button size={'sm'} variant="outline" className="text-green-400 hover:text-green-300 hover:bg-green-500/20 border-green-500/30 flex items-center font-bold h-8 px-2 py-1 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                        <span className="hidden sm:inline">Add Material</span>
                        <span className="sm:hidden">Add</span>
                        <PlusIcon strokeWidth={3.5} className="h-4 w-4 ml-1"/>
                    </Button>
                    </AddMaterialModal>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {materials.length > 0 ? (
                            materials.map((material) => (
                                <div
                                    key={material.id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        itemBgColor,
                                        textColor,
                                        itemBorderColor,
                                        "hover:bg-gray-600/50 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className='flex gap-x-3 items-center cursor-pointer'>
                                        <File/> <span>{material.title}</span>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Material</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete <span className="font-bold">{material.title}</span>? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteMaterial(material.id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File className={`h-16 w-16 ${textColor} opacity-20 mb-4`} />
                                <p className={`${textColor} font-medium`}>No materials available</p>
                                <p className={`${textColor} opacity-70 text-sm mt-1`}>Click 'Add Material' to upload study resources</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}