import { createRecord, ModelName, readRecordByUserId, updateRecord } from '@/app/actions/crud';
import { activity } from '@/app/actions/task';
import { useAuth } from '@clerk/nextjs';
import React, { ElementRef, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

type Props = {
    model: ModelName,
    colName: string,
    value: string,
    id: string,
    setEditable: (editable: boolean) => void,
    setValue: (value: string) => void,
    selectValues: any,
    userId? : string
}

const SelectInputEdit = ({ model, colName, value, id, setEditable, setValue, selectValues, userId }: Props) => {
    // console.log(value);
    const textRef = useRef<ElementRef<"select">>(null);
    const handleClickOutsideTitle = () => {
        setEditable(false);
        // Your custom logic here
    }

    useOnClickOutside(textRef, handleClickOutsideTitle);

    const onValueChange = async () => {
        // console.log(textRef?.current?.value!);
        setValue(textRef?.current?.value!);
        await updateRecord(model, id, { [colName]: textRef?.current?.value! });
        const changed : activity = 'change status';
        const user = await readRecordByUserId('User', userId!);
        const data = {
            type: changed,
            taskId: id,
            ownerId : user?.id,
            comment: `Task changed of ${colName} from ${value} to ${textRef?.current?.value}`
        }
        await createRecord('Activity', data);
        // console.log(obj);
        setEditable(false);
    }

    return (
        <select className='p-1 rounded-md w-full'
            ref={textRef} value={value} onChange={onValueChange}>
            {selectValues.map((prio: any, idx: number) => (
                <option key={idx} value={prio.name}>
                    {prio.value}
                </option>
            ))}
        </select>

    )
}

export default SelectInputEdit;
