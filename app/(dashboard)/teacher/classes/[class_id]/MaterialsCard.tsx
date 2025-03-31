'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { File, PlusIcon, Trash, Download, Search } from 'lucide-react';
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
import useClassStore from '@/store/useClassStore';
import useUserStore from '@/store/userStore';
import {  downloadMaterial, Material } from '@/services/materialsServices';
import { useMaterialStore } from '@/store/useMaterialStore';
import { useState } from 'react';


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
    const selectedClass=useClassStore(state=>state.selectedClass);
    const token=useUserStore(state=>state.user.token);
    const { deleteMaterialById } = useMaterialStore();
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // Filter materials based on search query
    const filteredMaterials = materials.filter(material => {
        return material.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
     const handleDeleteMaterial = async (materialId: string) => {
        // Implement delete logic here
        try {
            const success = await deleteMaterialById(materialId, token as string);
            if (!success){
                console.error('Failed to delete material');
            }
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete material:', error);
        }
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

    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Materials</CardTitle>
                    <AddMaterialModal  classId={selectedClass?.class_id as string} >
                    <Button size={'sm'} variant="outline" className="text-green-400 hover:text-green-300 hover:bg-green-500/20 border-green-500/30 flex items-center font-bold h-8 px-2 py-1 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                        <span className="hidden sm:inline">Add Material</span>
                        <span className="sm:hidden">Add</span>
                        <PlusIcon strokeWidth={3.5} className="h-4 w-4 ml-1"/>
                    </Button>
                    </AddMaterialModal>
                </div>
                <Separator className={separatorColor} />
                
                {/* Search input */}
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search materials..."
                        className="pl-8 h-9"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {filteredMaterials.length > 0 ? (
                            filteredMaterials.map((material) => (
                                <div
                                    key={material._id}
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
                                        <File/> <span>{material.file_name.length > 50  ? material.file_name.substring(0, 26) + '...' + material.file_name.substring(material.file_name.lastIndexOf('.')) : material.file_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                                            onClick={() => handleDownload(material.material_id)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
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
                                                        Are you sure you want to delete <span className="font-bold">{material.file_name}</span>? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteMaterial(material.material_id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File className={`h-16 w-16 ${textColor} opacity-20 mb-4`} />
                                <p className={`${textColor} font-medium`}>
                                    {searchQuery 
                                        ? 'No materials match your search' 
                                        : 'No materials available'
                                    }
                                </p>
                                <p className={`${textColor} opacity-70 text-sm mt-1`}>
                                    {!searchQuery && "Click 'Add Material' to upload study resources"}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}