import React, { createContext, useEffect,useState } from "react";
import "./ErrorContext.css"

const ErrorContext = createContext();

function AbsolutePrompt(props){
    const [promptObj,setPromptObj] = useState({code:1,display:0})
    const [showPrompt,setShowPrompt] = useState(0);
    useEffect(()=>{
        if(props.promptObj.display != undefined && props.promptObj.display == 1) {
            setPromptObj(props.promptObj)
            setShowPrompt(1)
        }
    },[props.promptObj])

    return (
        <div id="promptCont">
            {
                showPrompt == 0 ? <div/> :
                <div id="promptBkg" onClick={()=>(setShowPrompt(0))}>
                    <div id="promptBodyCont" onClick={(e)=>{e.stopPropagation()}}>
                        <div id="promptTitle">Test</div>
                        <div id="promptContent">Test.</div>
                    </div>
                </div>
            }
        </div>
    )
}

export {AbsolutePrompt}
export default ErrorContext;