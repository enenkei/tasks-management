'use client';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Project } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { KanbanIcon } from 'lucide-react';
import AddProject from './add-project';
import Image from 'next/image';
import moment from 'moment';
import { useRouter } from 'next/navigation';


type Props = {
    isEmpty: boolean,
    project?: Project,
    user: any,
    refetchProjects: () => void
}

const ProjectCard = ({ isEmpty, project, user, refetchProjects }: Props) => {
    const router = useRouter();
    const [openProjectDialog, setOpenProjectDialog] = useState<boolean>(false);

    if (isEmpty) {
        return (
            <>
                {/* <Card className='border-dashed shadow-none border-blue-600 border-2 p-2 h-[250px]' role='button'
                    onClick={() => setOpenProjectDialog(true)}>
                    <CardHeader>
                        <CardTitle className='flex justify-center items-center'>
                            Add a new project<KanbanIcon className='h-7 w-7 ml-2' color='#273bd3' /></CardTitle>
                    </CardHeader>
                    <CardContent className='flex items-center justify-center'>
                        <Image src={'/images/undraw_website_ij0l.svg'} width={120} height={200} className='object-contain' alt='undraw_website_ij0l.svg' />
                    </CardContent>
                    <CardFooter className='flex justify-center items-center'>
                        <p className='text-xs text-muted-foreground'>Click here to add</p>
                    </CardFooter>
                </Card> */}
                <div className="rounded-md p-6 border-2 border-dashed border-cyan-600 shadow-md h-[250px] hover:cursor-pointer" 
                    role='button' 
                    onClick={() => setOpenProjectDialog(true)}>
                    <div
                        className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full bg-teal-400 shadow-lg shadow-teal-500/40">
                        <img
                            src={'https://api.dicebear.com/9.x/shapes/svg?seed=Aneka'}
                            alt="proj-avatar"
                            className='rounded-md'
                        />
                    </div>
                    <div className='flex items-center justify-center mt-10 gap-y-4 bg-slate-100 p-2 rounded-md'>
                        <p className='text-xs text-muted-foreground text-center'>Click here to add a project</p>
                    </div>
                </div>
                <AddProject
                    onOpenChange={setOpenProjectDialog}
                    open={openProjectDialog}
                    refetchProjects={refetchProjects}
                    userId={user?.id!}
                    userName={user?.fullName!} />
            </>
        )
    } else {
        return (
            <>
                <div className="rounded-md bg-white p-6 text-center shadow-md h-[250px] hover:cursor-pointer" 
                    role='button' 
                    onClick={() => router.push(`/project/${project?.id}/dashboard`)}>
                    <div
                        className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full bg-teal-400 shadow-lg shadow-teal-500/40">
                        <img
                            src={`https://api.dicebear.com/9.x/shapes/svg?feed=${project?.createdBy}`}
                            alt="proj-avatar"
                            className='rounded-md'
                        />
                    </div>
                    <h1 className="text-darken mb-3 text-md font-medium px-3 capitalize">{project?.name}</h1>
                    <div className='grid grid-cols-2 items-center justify-start text-sm gap-y-4 bg-slate-100 p-2 rounded-md'>
                        <p className="px-4 text-gray-500 text-pretty text-left">Created by</p>
                        <span className='text-right text-cyan-500'>{project?.createdBy}</span>
                        <p className="px-4 text-gray-500 text-pretty text-left">Created at</p>
                        <span className='text-right text-cyan-500'>{moment(project?.createdAt).fromNow()}</span>
                    </div>
                </div>

            </>
        )
    }
}

export default ProjectCard;
