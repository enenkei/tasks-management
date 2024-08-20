'use client';
import React, { MouseEvent, useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowBigRightDashIcon, Loader2Icon, PointerIcon } from 'lucide-react';
import Hint from '@/app/(main)/_component/hint';
import { Button } from '@/components/ui/button';
import { createRecord, readRecord, readRecordByUserId, updateRecord } from '@/app/actions/crud';
import { activity, getTasksByProject } from '@/app/actions/task';
import { User } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserAvatar from '@/app/(main)/_component/user-avatar';
import { getInitials } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';

type Props = {
    taskId: string,
    currentStage: string,
    userId: string,
    users: User[],
    open : boolean,
    onOpenChange : (open : boolean) => void,
    setProject : (proj : any) => void
}

export const STAGES = [
    { name: 'todo', value: 'TODO' },
    { name: 'inprogress', value: 'IN PROGRESS' },
    { name: 'review', value: 'IN REVIEW' },
    { name: 'completed', value: 'COMPLETED' }
];

const TaskNextStageDialog = ({ taskId, currentStage, userId, users, open, onOpenChange, setProject }: Props) => {
    const params = useParams();
    const currentIdx = STAGES.findIndex((element) => element.name === currentStage);
    const nextStage = STAGES[currentIdx + 1]?.name;
    const isNextStageReview = nextStage === 'review';
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const onButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPending(true);
        // console.log(taskId);
        // console.log(selectedUserId);
        try {
            const upd = await updateRecord('Task', taskId, { stage: STAGES[currentIdx + 1]?.name });
            if (upd) {
                if (isNextStageReview) {
                    if (!selectedUserId) {
                        toast({
                            title: 'Error!',
                            description: 'Reviewer cannot be empty'
                        });
                        return;
                    }
                    const review: activity = 'review';
                    const user = await readRecord('User', selectedUserId);
                    const data = {
                        type: review,
                        taskId: taskId,
                        ownerId: user?.id,
                        comment: `Task sent to ${user?.name} for review`
                    }
                    await createRecord('Activity', data);
                } else {
                    const changed: activity = 'change status';
                    const user = await readRecordByUserId('User', userId);
                    const data = {
                        type: changed,
                        taskId: taskId,
                        ownerId: user?.id,
                        comment: `Task changed of stage from ${currentStage} to ${STAGES[currentIdx + 1]?.name}`
                    }
                    await createRecord('Activity', data);
                }
                const proj = await getTasksByProject(userId!, params?.pid as string);
                setProject(proj);
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Error!',
                description: 'Error while change task stage, try again later'
            });
        } finally {            
            setIsPending(false);
            onOpenChange(!open);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-pretty text-sm'>
                        Moving this task from
                        <span className='capitalize bg-slate-200 p-1 rounded-md'>&nbsp;{currentStage}&nbsp;</span>
                        to the next stage<span className='capitalize bg-slate-200 p-1 rounded-md'>&nbsp;{STAGES[currentIdx + 1]?.name}&nbsp;?</span>
                    </DialogTitle>
                    <DialogDescription>
                        <span className='text-rose-500 flex items-center justify-center gap-2 my-5'>
                            <PointerIcon className='h-4 w-4' />This action cannot be undone
                        </span>
                    </DialogDescription>
                </DialogHeader>
                {isNextStageReview && (
                    <div className='flex items-end'>
                        <Select value={selectedUserId} onValueChange={(e) => setSelectedUserId(e)}>
                            <SelectTrigger className="w-full h-full">
                                <SelectValue placeholder="Send to review" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.length > 0 && users.map((user: User, idx: number) => {
                                    return (
                                        <SelectItem key={user?.id} value={user?.id}>
                                            <div key={user?.id + idx} className='flex items-center gap-2 justify-center'>
                                                {user?.name}
                                                <UserAvatar key={idx}
                                                    imgSrc={user?.avatar!}
                                                    fallbackText={getInitials(user?.name)} />
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <DialogFooter>
                    <div className='flex items-center justify-center gap-3'>
                        <Button disabled={isPending} variant={'secondary'} onClick={(e) => onButtonClick(e)} type='button'>
                            Proceed&nbsp;{isPending && <Loader2Icon className='w-4 h-4 ml-2 animate-spin' />}
                        </Button>
                        <DialogClose className='text-sm text-rose-600'>Cancel</DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TaskNextStageDialog;
