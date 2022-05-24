import { Button, Paper } from "@mui/material";
import React, {useRef, useState} from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { IUploadArea } from "./IUploadArea";

const UploadArea = React.memo(
    (props: React.PropsWithChildren<IUploadArea>) => {
        const {
            onDrag,
            onDrop,
            onDragIn,
            onDragOut,
            onDropFiles,
            onDragStateChange,
        } = props
        
        // Keeps track of dragging
        const [isDragging, setIsDragging] = useState(false)
        const UploadAreaRef = useRef<null | HTMLDivElement>(null)

        // Functions
        const handleDragIn = React.useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                onDragIn?.()

                // If a file is being dragged set the isDragging var to true
                if (e.dataTransfer.items && e.dataTransfer.length > 0){
                    setIsDragging(true)
                }
            },
            [onDragIn]
        )

        const handleDragOut = React.useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                onDragOut?.()
                setIsDragging(false)
            },
            [onDragOut]
        )

        const handleDrag = React.useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                onDrag?.()

                // If a file is being dragged set the isDragging var to true
                if (!isDragging){
                    setIsDragging(true)
                }
            },
            [isDragging,onDrag]
        )

        const handleDrop = React.useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                setIsDragging(false)
                onDrop?.()

                if (e.dataTransfer.items && e.dataTransfer.length > 0){
                    // Add files to an array
                    const uploadFiles = []

                    for (let i = 0; i < e.dataTransfer.files.length; i++){
                        uploadFiles.push(e.dataTransfer.files.item(i))
                    }
                    onDropFiles?.(uploadFiles)
                    e.dataTransfer.clearData() // Clear upload area for next upload
                }
               
            },
            [onDrop,onDropFiles]
        )
        
        // Rendered HTML 
        return (
            <div
                ref={UploadAreaRef}
            >
                {props.children}
            </div>
        )
    }      
)


export default UploadArea