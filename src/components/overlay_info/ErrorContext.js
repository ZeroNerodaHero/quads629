import React, { createContext, useEffect,useState } from "react";
import "./ErrorContext.css"

const ErrorContext = createContext();

function AbsolutePrompt(props){
    const [showPrompt,setShowPrompt] = useState(0);

    const [title,setTitle] = useState("Error")
    const [content, setContent] = useState("Error")

    useEffect(()=>{
        if(props.promptObj.display != undefined && props.promptObj.display == 1) {
            setShowPrompt(1)
            setTitle(props.promptObj.title)
            setContent(props.promptObj.content)
        }
    },[props.promptObj])

    return (
        <div id="promptCont">
            {
                showPrompt == 0 ? <div/> :
                <div id="promptBkg" onClick={()=>(setShowPrompt(0))}>
                    <div id="promptBodyCont" onClick={(e)=>{e.stopPropagation()}}>
                        <div id="promptTitle">{title}</div>
                        <div id="promptContent">{content}</div>
                    </div>
                </div>
            }
        </div>
    )
}

export {AbsolutePrompt}
export default ErrorContext;