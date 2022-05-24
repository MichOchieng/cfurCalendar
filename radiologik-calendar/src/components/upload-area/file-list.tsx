import React, { memo, PropsWithChildren } from "react";

import { IFileList } from "./interfaces/IFileList";

const FileList = memo(
    (props: PropsWithChildren<IFileList>) => (
        <ul>
            {props.files.map((file: File) => (
                <li>
                    <span>{file.name}</span>{' '}
                    <span>({Math.round(file.size / 1000)}kb)</span>
                </li>
            ))}
        </ul>
    )
)

export default FileList