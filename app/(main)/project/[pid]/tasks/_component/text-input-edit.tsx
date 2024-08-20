import { createRecord, ModelName, readRecordByUserId, updateRecord } from '@/app/actions/crud';
import { activity } from '@/app/actions/task';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/nextjs';
import React, { ElementRef, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts';

type Props = {
    model: ModelName,
    colName: string,
    value: string,
    id: string,
    setEditable: (editable: boolean) => void,
    setValue: (value: string) => void,
    userId? : string
}



const TextInputEdit = ({ model, colName, value, id, setEditable, setValue, userId }: Props) => {
    // console.log(id);
    // console.log(value);
    const textRef = useRef<ElementRef<"input">>(null);
    const handleClickOutsideTitle = () => {
        setEditable(false);
        // Your custom logic here
    }

    useOnClickOutside(textRef, handleClickOutsideTitle);

    const onKeydown = async (e: React.KeyboardEvent) => {
        if (e.key == 'Enter') {
            setValue(textRef?.current?.value!);
            await updateRecord(model, id, { [colName]: textRef?.current?.value! });
            // console.log(obj);
            const changed: activity = 'change status';
            const user = await readRecordByUserId('User', userId!);
            const data = {
                type: changed,
                taskId: id,
                ownerId: user?.id,
                comment: `Task changed of ${colName} from ${value} to ${textRef?.current?.value}`
            }
            await createRecord('Activity', data);
            setEditable(false);
        } else if (e.key == 'Escape') {
            setEditable(false);
        }
    }

    return (
        <Input className='ml-3' ref={textRef} defaultValue={value} autoFocus onKeyDown={onKeydown} />
    )
}

export default TextInputEdit;
