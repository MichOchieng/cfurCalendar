import React from "react";

export interface IUploadArea{
    onDrag?:      () => void
    onDrop?:      () => void
    onDragIn?:    () => void
    onDragOut?:   () => void
    onDropFiles?: (files: File[]) => void
    onDragStateChange?: (dragActive: boolean) => void
}