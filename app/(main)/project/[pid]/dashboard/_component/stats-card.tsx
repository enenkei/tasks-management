import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";

import React from 'react';

type Props = {
    icon: any,
    bg: string,
    label: string,
    count: number
}

const StatsCard = ({ icon, bg, label, count }: Props) => {
    return (
        <Card className="w-full bg-white p-2 shadow-sm rounded-md">
            <CardContent>
                <CardTitle className="h-full flex flex-1 flex-row justify-between items-center mt-2">
                    <p className="text-base text-gray-600">{label}</p>
                    <span className="text-xl font-semibold">{count}</span>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white",
                        bg
                    )}>
                        {icon}
                    </div>
                </CardTitle>
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>

    )
}

export default StatsCard;
