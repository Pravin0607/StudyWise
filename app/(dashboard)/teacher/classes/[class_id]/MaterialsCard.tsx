'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { File, PlusIcon } from 'lucide-react';

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
    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Materials</CardTitle>
                    <Button size={'sm'} variant="outline" className="text-green-400 hover:text-green-300 hover:bg-green-500/20 border-green-500/30 flex items-center font-bold md:h-9 md:px-4 md:py-2 md:text-sm">
                        Add Material <PlusIcon strokeWidth={3.5}/>
                    </Button>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {materials.map((material) => (
                            <div
                                key={material.id}
                                className={cn(
                                    "p-3 rounded-md",
                                    itemBgColor,
                                    textColor,
                                    itemBorderColor,
                                    "hover:bg-gray-600/50 transition-colors duration-200 cursor-pointer",
                                    "flex gap-x-3 items-center"
                                )}
                            >
                                <File/> <span>{material.title}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}