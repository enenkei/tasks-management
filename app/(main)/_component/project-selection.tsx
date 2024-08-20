'use client';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { readRecord, readRecords } from '@/app/actions/crud';
import { Project } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowRightCircleIcon, SquareChartGanttIcon, XCircleIcon } from 'lucide-react';
import Hint from './hint';
import { useParams, useRouter } from 'next/navigation';
import { useOnClickOutside } from 'usehooks-ts';

const ProjectSelection = () => {
    // console.log(projectId);    
    const params = useParams();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [project, setProject] = useState<Project>();
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [projects, setProjects] = useState<Project[]>();
    const router = useRouter();
    const projectId = params?.pid;
    const selectRef = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        getCurrentProject(projectId as string);
        getCurrentProjects(projectId as string);
    }, [setIsEditing]);

    const getCurrentProject = async (projectId: string) => {
        // console.log(projectId);
        const project = await readRecord('Project', projectId as string);
        setProject(project);
    }

    const getCurrentProjects = async (projectId: string) => {
        const projects = await readRecords('Project', {});
        setProjects(projects?.filter((proj: Project) => proj.id !== projectId));
    }

    const switchProject = (projectId: string) => {
        console.log(projectId);
        if (projectId === 'None') {
            setIsEditing(false);
        } else {
            router.push(`/project/${projectId}/dashboard`);
            setIsEditing(false);
            getCurrentProject(projectId);
            getCurrentProjects(projectId);
            router.refresh();
        }
    }

    // const handleClickOutside = () => {
    //     setIsEditing(false);
    // }
    // useOnClickOutside(selectRef, handleClickOutside);

    return (
        <div className='flex items-center justify-start my-3'>
            {!isEditing ? (
                <>
                    <Hint label='Click to switch project'>
                        <Button variant={'secondary'} className='w-64 flex gap-3' onClick={() => setIsEditing(true)}>
                            <span className='text-md capitalize underline underline-offset-4 font-semibold'>
                                {project?.name}</span><SquareChartGanttIcon className='h-4 w-4' />
                        </Button>
                    </Hint>

                </>
            ) : (
                <>
                    <div className='flex items-center justify-center gap-2' ref={selectRef}>
                        <Select onValueChange={(e) => {
                            if(e === 'None'){
                                setIsEditing(false);
                                return;
                            }
                            setSelectedProjectId(e);
                        }}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects?.length! > 0 ? projects?.map((proj, idx) => (
                                    <SelectItem
                                        key={proj.id + idx+  proj.name} value={proj.id}>{proj.name}</SelectItem>
                                )) : (
                                    <SelectItem
                                        key={918201} value={"None"}>You have no other projects</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <ArrowRightCircleIcon className='h-4 w-4 hover:cursor-pointer text-blue-700'
                            onClick={() => switchProject(selectedProjectId)} />
                        <XCircleIcon className='h-4 w-4 hover:cursor-pointe text-red-700' onClick={() => setIsEditing(false)} />
                    </div>

                </>
            )
            }


        </div >
    )
}

export default ProjectSelection;
