import { Button, Paper } from "@mui/material";
import React, {Component, useRef, useState} from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';


class UploadArea extends Component{

    state = {
        dragging: false,
        drags: 0
    }

    // e.preventDefault()
    // - Stops default behavior from the browser when dragging occurs
    // e.stopPropagation()
    // - Stops propagation from parent to child


    onDrag = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }

    onDragIn = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        // Check to see if anything is being dragged and change to state accordingly
        this.state.drags++
        if(e.dataTransfer.items && e.dataTransfer.items.length > 0){
            this.setState({dragging: true})
        }
    }

    onDragOut = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

        this.state.drags--
        if (this.state.drags > 0 ) return
        this.setState({dragging: false})
    }

    onDrop = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }

    dropRef = React.createRef();

    componentDidMount() {
        let div = this.dropRef.current as HTMLElement
        div.addEventListener('dragenter', this.onDragIn)
        div.addEventListener('dragleave', this.onDragOut)
        div.addEventListener('dragover', this.onDrag)
        div.addEventListener('drop', this.onDrop)
    }

    componentWillMount() {
        let div = this.dropRef.current as HTMLElement
        div.removeEventListener('dragenter', this.onDragIn)
        div.removeEventListener('dragleave', this.onDragOut)
        div.removeEventListener('dragover', this.onDrag)
        div.removeEventListener('drop', this.onDrop)
    }

    render() {
        return(
            <div
                ref={this.dropRef as React.RefObject<HTMLDivElement>}
            >
                
            </div>
        )
    }
}

export default UploadArea