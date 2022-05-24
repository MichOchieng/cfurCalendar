import { 
        memo,
        PropsWithChildren,
        useCallback,
        useEffect,
        useRef,
        useState
        } 
    from "react";
import { 
        Button,
        Paper 
        } 
    from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { IUploadArea } from "./interfaces/IUploadArea";

const UploadArea = memo(
    (props: PropsWithChildren<IUploadArea>) => {
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

        // Take FileList and map to an array
        const mapFiles = (files: FileList) => {
            const arr = []
            
            for (let i = 0; i< files.length; i++){
                arr.push(files.item(i))
            }

            return arr as File[]
        }
        //      Handlers
        const handleDragIn = useCallback(
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

        const handleDragOut = useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                onDragOut?.()
                setIsDragging(false)
            },
            [onDragOut]
        )

        const handleDrag = useCallback(
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

        const handleDrop = useCallback(
            (e: any) => {
                // Stops default dragging behaviour and propagation from parent to child
                e.preventDefault()
                e.stopPropagation()
                
                setIsDragging(false)
                onDrop?.()

                if (e.dataTransfer.items && e.dataTransfer.length > 0){
                    // Add files to an array
                    const uploadFiles = mapFiles(e.data.dataTransfer.files)

                    onDropFiles?.(uploadFiles)
                    // Clear upload area for next upload
                    e.dataTransfer.clearData() 
                }
               
            },
            [onDrop,onDropFiles]
        )
        
        // Watch for and emit state changes
        useEffect(() => {
            onDragStateChange?.(isDragging)
        },[isDragging])

        // Attach listeners to the upload area
        useEffect(() => {
            const temp = UploadAreaRef?.current
            if(temp) {
                temp.addEventListener('dragenter',handleDrag)
                temp.addEventListener('dragenter',handleDrop)
                temp.addEventListener('dragenter',handleDragIn)
                temp.addEventListener('dragenter',handleDragOut)
            }

            // Unmount liteners
            return () => {
                temp?.removeEventListener('dragenter',handleDrag)
                temp?.removeEventListener('dragenter',handleDrop)
                temp?.removeEventListener('dragenter',handleDragIn)
                temp?.removeEventListener('dragenter',handleDragOut)
            }
        })
        
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