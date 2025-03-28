'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { DownloadCloudIcon, File, Trash } from 'lucide-react';

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
                <div className="flex justify-between items-center">
                    <CardTitle className={cn("text-lg", textColor)}>
                        Materials
                    </CardTitle>
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
                                        "group hover:bg-accent/10 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className="flex gap-x-3 items-center cursor-pointer">
                                        <File className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="group-hover:text-accent-foreground transition-colors">
                                            {material.title}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <DownloadCloudIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File
                                    className={`h-16 w-16 ${textColor} opacity-20 mb-4`}
                                />
                                <p className={`${textColor} font-medium`}>
                                    No materials available
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}