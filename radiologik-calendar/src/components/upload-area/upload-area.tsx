import { 
        memo,
        PropsWithChildren,
        useCallback,
        useEffect,
        useRef,
        useState
        } 
    from "react";
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
            console.log("mapping");
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
                    console.log("handleDragIn");
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
                console.log("handleDragOut");
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
                console.log("handleDrag");
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
                console.log("handleDrop");

                if (e.dataTransfer.files && e.dataTransfer.files.length > 0){
                    // Add files to an array
                    console.log("uploading");
                    
                    const uploadFiles = mapFiles(e.dataTransfer.files)

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
                console.log("Mounting...");
                temp.addEventListener('drop',handleDrop)
                temp.addEventListener('dragover',handleDrag)
                temp.addEventListener('dragenter',handleDragIn)
                temp.addEventListener('dragleave',handleDragOut)
            }

            // Unmount liteners
            return () => {
                console.log("Unmounting...");
                temp?.removeEventListener('drop',handleDrop)
                temp?.removeEventListener('dragover',handleDrag)
                temp?.removeEventListener('dragenter',handleDragIn)
                temp?.removeEventListener('dragleave',handleDragOut)
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