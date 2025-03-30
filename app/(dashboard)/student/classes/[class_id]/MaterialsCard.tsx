'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Endpoints } from '@/lib/apiEndpoints';
import { cn } from "@/lib/utils";
import { downloadMaterial } from '@/services/materialsServices';
import { useClassStudent } from '@/store/useClassStudent';
import useUserStore from '@/store/userStore';
import axios from 'axios';
import { DownloadCloudIcon, File, Trash, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';

interface Material {
    _id: string;
    material_id: string;
    file_name: string;
    file_ext: string;
    uploaded_date: string;
}

interface MaterialsCardProps {
    textColor: string;
    cardBgColor: string;
    cardBorderColor: string;
    separatorColor: string;
    itemBgColor: string;
    itemBorderColor: string;
}

export function MaterialsCard({
    textColor,
    cardBgColor,
    cardBorderColor,
    separatorColor,
    itemBgColor,
    itemBorderColor
}: MaterialsCardProps) {
    const selectedClass = useClassStudent(state=>state.selectedClass);
    const [materialList, setMaterialList] = useState([] as Material[]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMaterialList, setFilteredMaterialList] = useState([] as Material[]);
    const token = useUserStore(state => state.user.token);
    const handleDownload = async (materialId: string) => {
        try {
            const downloadUrl = await downloadMaterial(materialId, token as string);
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to download material:', error);
            toast.error('Failed to download material');
        }
    };

    useEffect(()=>{
        (async()=>{
            try{

                const resp=await axios.get(Endpoints.STUDENT.GETMATERIALLIST.replace(":classId",selectedClass?.class_id!),{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMaterialList(resp.data);
            }catch(error){
                console.error('Error fetching materials:', error);
                toast.error('Error fetching materials');
            }
        })()
    },[])

    useEffect(() => {
        if (searchQuery) {
            const filtered = materialList.filter(material =>
                material.file_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMaterialList(filtered);
        } else {
            setFilteredMaterialList([...materialList]);
        }
    }, [searchQuery, materialList]);
    
    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className={cn("text-lg", textColor)}>
                        Materials
                    </CardTitle>
                </div>
                    <Separator className={separatorColor} />
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search materials..."
                        className="pl-8 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {filteredMaterialList.length > 0 ? (
                            filteredMaterialList.map((material) => (
                                <div
                                    key={material.material_id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        itemBgColor,
                                        textColor,
                                        itemBorderColor,
                                        "group hover:bg-accent/10 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className="flex gap-x-3 items-center cursor-pointer">
                                        <File className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="group-hover:text-accent-foreground transition-colors">
                                            {material.file_name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleDownload(material.material_id)}
                                    >
                                        <DownloadCloudIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                {searchQuery ? (
                                    <p className={`${textColor} font-medium`}>
                                        No materials found for "{searchQuery}"
                                    </p>
                                ) : (
                                    <>
                                        <File
                                            className={`h-16 w-16 ${textColor} opacity-20 mb-4`}
                                        />
                                        <p className={`${textColor} font-medium`}>
                                            No materials available
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}