import { List, ListItem, Paper, Typography } from "@mui/material";
import { memo, PropsWithChildren } from "react";

import { IFileList } from "./interfaces/IFileList";

const FileList = memo(
    (props: PropsWithChildren<IFileList>) => (
        <Paper
            sx={{
                boxShadow:"none"
            }}
        >
            <List>
                {props.files.map((file: File) => (
                    <ListItem>
                        <Typography>
                            {file.name} {' '} ({Math.round(file.size / 1000)}kb)
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
)

export default FileList