// react
import React, { useState, useEffect, useRef } from 'react';
import "./Overlay.css"
import ReactToPrint from "react-to-print";

function Overlay(props){
    const [overlayState,setOverlayState] = useState(0)
    return (
        <div id="overlay_cont" onClick={()=>{setOverlayState(0)}}>
            <div id="overlay_scrollController">
                <div id="overlay_scrollConstraint">
                    {
                        overlayState == 1 ? <div onClick={(e)=>{e.stopPropagation()}}><OverlayTop /></div> :
                        <div onClick={(e)=>{setOverlayState(1);e.stopPropagation()}} id="overLayTopTemp" className="overlayTemp">
                            <div className="overlayTempBody">
                                <div className="overlayTempText">Find Help</div>
                            </div>
                        </div>
                    }
                    {
                        overlayState == 2 ? <div onClick={(e)=>{e.stopPropagation()}}><OverlayBottom /></div> :
                        <div onClick={(e)=>{setOverlayState(2);e.stopPropagation()}} id="overLayBotTemp" className="overlayTemp">
                            <div className="overlayTempBody">
                                <div className="overlayTempText">About AG Electrics</div>
                            </div>
                        </div> 
                    }
                </div>
            </div>
        </div>
    )
}

function OverlayTop(props){
    const [topState,setTopState] = useState(0)
    

    const nullState = (
        <div>
            <div className="requestCont">
                <div className="top_heading">
                    Find my request
                </div>
                <PhoneInput setTopState={setTopState}/>
            </div>
            <div id="newRequestCont">
                Or <br/>
                <button onClick={()=>{setTopState(2)}}>New Request</button>
            </div>
        </div>
    )

    const [topCont,setTopCont] = useState(nullState)

    useEffect(()=>{
        if(topState === 1) setTopCont(<RequestState />)
        if(topState === 2) setTopCont(<FormState />)
    },[topState])

    return (
        <div id="overlay_top">
            {topCont}
        </div>
    )
}

function FormState(){
    const [name,setName] = useState("")
    const [phoneNum,setPhoneNum] = useState("")
    const [email,setEmail] = useState("")
    const [location,setLocation] = useState("")
    const [descript,setDescript] = useState("")

    return (
        <div>   
            <div className="requestCont">
                <div className="top_heading">Get AG Electric's Help</div><br/>
                <div id="formBody">
                    <div className="formItem">
                        <div>Name</div>
                        <input value={name} onChange={(e)=>{setName(e.target.value)}}/>
                    </div>
                    <div className="formItem">
                        <div>Phone Number</div>
                        <input value={phoneNum} onChange={(e)=>{setPhoneNum(e.target.value)}}/> 
                    </div>
                    <div className="form_subText">
                        Primary Communication with me.
                    </div>
                    <div className="formItem">
                        <div>Email</div>
                        <input value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    <div className="form_subText">
                        Used to send invoices.
                    </div>
                    <div className="formItem">
                        <div>Location</div>
                        <input value={location} onChange={(e)=>{setLocation(e.target.value)}}/>
                    </div>
                    <div className="formItem">
                        <div>Description</div>
                        <textarea value={descript} onChange={(e)=>{setDescript(e.target.value)}}/>
                    </div>
                    <div className="form_subText">
                        Please briefly explain your situation.
                    </div>
                    <div id="formImages">
                        <div className="formImageCont">
                            <div className="formImageDisplay"></div>
                            <input type="file" className="formImageForm" />
                        </div>
                    </div>
                    <div className="formItem">
                        <div></div>
                        <button onClick={()=>{}}>
                            Submit
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

function RequestState(props){
    const toPrint = useRef(null);
    return (
        <div id="requesterInfo">
            <div id="currentRequest">
                <div id="toPrint" ref={toPrint}>
                    <div>Your current request: <b>123345</b></div>
                    <div>Phone Number <b>408-888-1111</b></div>
                    <div>Filed on: <b>Dec 31 2023 1:2:3</b></div>
                    <div>Invoice amount: $100</div>
                    <div>Rate: ***** [Review]</div>
                </div>
                <button onClick={()=>{
                    var printComp = window.open("")
                    printComp.document.write(toPrint.current.innerHTML)
                    printComp.document.close(); 
                    printComp.focus();
                    printComp.print();
                }}>Print</button>
            </div>
            <div>
                Old requests
            </div>
        </div>
    )
}

function PhoneInput(props){
    const [curPhonePos,setCurrentPhonePos] = useState(-1);
    const phoneNum = new Array(9).fill(0);
    const phoneNumParent = useRef(null);

    useEffect(()=>{
        console.log(curPhonePos)
        if(curPhonePos >= 0){
            phoneNumParent.current.children[curPhonePos].focus();
        }
    },[curPhonePos])

    return (
        <div id="phoneNumInputSearch" ref={phoneNumParent} onClick={()=>{setCurrentPhonePos(0)}}>
            {phoneNum.map((ele,index)=>(
                <input className="phoneNumInsert" key={index}
                    onFocus={(e)=>{e.target.value=""}}
                    onChange={(e)=>{setCurrentPhonePos(index+1)}}
                    maxLength="1"/>
            ))}
            <button onClick={(e)=>{
                var phoneNum = "";
                for(let it of phoneNumParent.current.children){
                    phoneNum += it.value;
                }
                console.log(phoneNum)
                e.stopPropagation();
                props.setTopState(1)
            }}>Enter</button>
        </div>
    );
}

function OverlayBottom(props){
    return (
        <div id="overlay_bot">
            <div id="bottomCont">
                <div id="bottomContRow_1">
                    <div id='bottomHeading'>
                        <div className="title">AG Electric</div>
                        <div><i>15200 Monterey Road, Morgan Hill, 95037</i></div>
                        <div><i>408-xxx-xxxx</i></div>
                    </div>
                    <img id="AG_picture" 
                        src="https://media.discordapp.net/attachments/709131875117170689/1080302331133972550/IMG_8990.jpg" /> 
                </div>
                <div className="bottomGridItem">
                    <div className="headText">
                        <b>About AG Electric</b>
                    </div>
                    <div className="bodyText">
                        {"1000 ".repeat(1000)}
                    </div>
                </div>

                <div className="bottomGridItem">
                    <div className="headText">
                        
                    </div>
                    <div className="bodyText">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overlay