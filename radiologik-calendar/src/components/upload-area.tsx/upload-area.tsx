import { Button, Paper } from "@mui/material";
import React, {useRef, useState} from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MAX_FILE_SIZE = 500000; // Bytes => 0.5mb

const UploadArea = (
    // label: string,
    // updateFilesCb: any,
    // maxFileSize = MAX_FILE_SIZE,
    ...otherProps: any[]
) => {
    const [files, setFiles] = useState({});
    const fileInputField    = useRef(null)

    // const handleUploadBtnClick = () => {
    //     fileInputField.current.click();
    //   };

    // const addNewFiles = (newFiles: any) => {
    //     for (let file of newFiles) {
    //         if (file.size <= maxFileSize){
    //             if(otherProps.length > 1){
    //                 return {file};
    //             }
    //             files[file.name] = file;
    //         }
    //     }
    //     return {...files};
    // };

    // const callUpdateFilesCb = (files: any) => {
    //     const filesAsArray = convertNestedObjectToArray(files);
    //     updateFilesCb(filesAsArray);
    //   };
    
    //   const handleNewFileUpload = (e: any) => {
    //     const { files: newFiles } = e.target;
    //     if (newFiles.length) {
    //       let updatedFiles = addNewFiles(newFiles);
    //       setFiles(updatedFiles);
    //       callUpdateFilesCb(updatedFiles);
    //     }
    //   };
    
    //   const removeFile = (fileName: any) => {
    //     delete files[fileName];
    //     setFiles({ ...files });
    //     callUpdateFilesCb({ ...files });
    //   };

    return(
        <>
            {/* Upload area */}
            <Paper>
                {/* <label>{label}</label> */}
                <p>Drag and drop files here!</p>
                {/* Add border and padding to button also needs to be centered with elements */}
                <Button>
                    <i><UploadFileIcon/></i>
                    <span>
                        Upload file(s){/*otherProps.multiple ? "files" : "a file"*/}
                    </span>
                </Button>
                <input 
                    type="file" 
                    ref={fileInputField}
                    title=""
                    value=""
                    {...otherProps}
                />
            </Paper>
            {/* Upload preview */}
            {/* <article>
                <span>To scan</span>
                <section>
                    {Object.keys(files).map((filename,index) => {
                        let file = files[filename];
                        return(
                            
                        )
                    })}
                </section>
            </article> */}
        </>
    )
}

export default UploadArea