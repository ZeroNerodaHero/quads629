// react
import React, { useState, useEffect, useRef, useContext } from 'react';
import "./Overlay.css"
import apiRequest from '../apiRequest/apiRequest';
import ErrorContext from './ErrorContext';

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
    const [userRequest,setUserRequest] = useState({})
    
    const nullState = (
        <div>
            <div className="requestCont">
                <div className="top_heading">
                    Find my request
                </div>
                <PhoneInput setTopState={setTopState} setUserRequest={setUserRequest}/>
            </div>
            <div id="newRequestCont">
                Or <br/>
                <button onClick={()=>{setTopState(2)}}>New Request</button>
            </div>
        </div>
    )

    const [topCont,setTopCont] = useState(nullState)

    useEffect(()=>{
        if(topState === 1) setTopCont(<RequestState userRequest={userRequest}/>)
        if(topState === 2) setTopCont(<FormState />)
    },[topState])

    return (
        <div id="overlay_top">{topCont}</div>
    )
}

function FormState(){
    const [name,setName] = useState("")
    const [phoneNum,setPhoneNum] = useState("")
    const [email,setEmail] = useState("")
    const [location,setLocation] = useState("")
    const [descript,setDescript] = useState("")

    const [formImages,setFormImages] = useState("")
    const fileInput = useRef(null)
    const [formImageCnt,setFormImageCnt] = useState(0)

    const {errorObj, setErrorObj} = useContext(ErrorContext)

    return (
        <div>   
            <div className="requestCont">
                <div className="top_heading">Get AG Electric's Help</div><br/>
                <div id="formBody">
                    <div className="formItem"><div>Name</div>
                        <input value={name} onChange={(e)=>{setName(e.target.value)}}/>
                    </div>
                    <div className="formItem"><div>Phone Number</div>
                        <input value={phoneNum} onChange={(e)=>{setPhoneNum(e.target.value)}}/> 
                    </div>
                    <div className="form_subText">Primary Communication with me.</div>
                    <div className="formItem"><div>Email</div>
                        <input value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    <div className="form_subText">Used to send invoices.</div>
                    <div className="formItem"><div>Location</div>
                        <input value={location} onChange={(e)=>{setLocation(e.target.value)}}/>
                    </div>
                    <div className="formItem"><div>Description</div>
                        <textarea value={descript} onChange={(e)=>{setDescript(e.target.value)}}/>
                    </div>
                    <div className="form_subText">
                        Please briefly explain your situation.
                    </div>
                    <div id="formImages">
                        <div className="formImageCont">
                            <div className="formImageDisplay" onClick={()=>{
                                fileInput.current.click()
                            }}>
                                {
                                    formImages == "" ? <div/> :
                                    <img className='formImageImg' src={formImages}/>
                                }
                            </div>
                            <input type="file" className="formImageForm" ref={fileInput} 
                                onChange={(e)=>{
                                    var tmpUpload = e.target.files
                                    if(tmpUpload != "" && tmpUpload[0] != null){
                                        setFormImages(URL.createObjectURL(tmpUpload[0]))
                                    }
                                }}/>
                        </div>
                    </div>
                    <div className="formItem">
                        <div></div>
                        <button onClick={()=>{
                            apiRequest("http://localhost:8080/","",
                            {
                                option: 2,
                                name: name,
                                phoneNum: phoneNum,
                                email: email,
                                location:location,
                                descript:descript
                            },
                            "POST").then((data)=>{
                                if(data["code"]!=0){
                                    console.log("werks")
                                } else{
                                    console.log("doesn't werk")
                                    setErrorObj({code:0,display:1,title:"Failed to Add Request",
                                        content:data["msg"]})
                                }
                            })
                        }}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RequestState(props){
    const [active,setActive] = useState(-1)
    const [past,setPast] = useState(-1)

    useEffect(()=>{
        if(props.userRequest.activeRequest != undefined){
            setActive(props.userRequest.activeRequest)
        }
        if(props.userRequest.oldRequest != undefined){
            setPast(props.userRequest.oldRequest)
        }
    },[props.userRequest])
    const toPrint = useRef(null);
    return (
        <div id="requesterInfo" onClick={()=>{console.log(props.userRequest)}}>
            <div className="requestHead">Current Request</div>
            <div id="currentRequest">
                {
                    active == -1 ? <div>You have no current requests</div> :
                    <div id="toPrint" ref={toPrint}>
                        <div>Hello <b>{active["name"]}</b></div>
                        <div>Phone Number <b>{active["phoneNum"]}</b></div>
                        <div>Filed on: <b>{active["request_time"]}</b></div>
                        <div>Description: <br/><b>{active["descript"]}</b></div>
                        <div>Photos Provided: <br/><b>{active["descript"]}</b></div>
                        <div>Status: {active["status"] == 0 ? "Not Seen Yet." : 
                            "Seen. I should have called you or texted you."}</div>
                    </div>
                }
                <button onClick={()=>{
                    var printComp = window.open("")
                    printComp.document.write(toPrint.current.innerHTML)
                    printComp.document.close(); 
                    printComp.focus();
                    printComp.print();
                }}>Print</button>
            </div>
            <div className="requestHead">Past Requests</div>
            {
                past == -1 ? <div>You have no past jobs with AG Electrics</div> :
                <div>
                    Old requests. Listed by date. Press print to print the invoice and costs.
                </div>
            }
        </div>
    )
}

function PhoneInput(props){
    const [curPhonePos,setCurrentPhonePos] = useState(-1);
    const phoneNum = new Array(10).fill(0);
    const phoneNumParent = useRef(null);
    const {errorObj, setErrorObj} = useContext(ErrorContext)


    useEffect(()=>{
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

                apiRequest("http://localhost:8080/","",
                {
                    option: 1,
                    phoneNum: phoneNum
                },
                "POST").then((data)=>{
                    if(data["code"]!=0){
                        props.setUserRequest(data);
                        props.setTopState(1)
                } else{
                        console.log("doesn't werk")
                        setErrorObj({code:0,display:1,title:"Failed to Find Phone Number",
                                        content:data["msg"]})
                    }
                })
            }}>Enter</button>
        </div>
    );
}

function OverlayBottom(props){
    const [displayAdmin,setDisplayAdmin] = useState(0)
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
                        {"1000 ".repeat(100)}
                    </div>
                </div>

                <div className="bottomGridItem">
                    <div className="headText">
                    </div>
                    <div className="bodyText">
                    </div>
                </div>
            </div>
            <div onClick={()=>{setDisplayAdmin(displayAdmin ^ 1)}}>Admin Login</div>
            <div id="adminPanelCont" style={{display:(displayAdmin == 0) ? "none" : "grid"}}
                onClick={()=>{setDisplayAdmin(0)}}>
                <AdminPanel />
            </div>
        </div>
    )
}

function AdminPanel(props){
    const [adminPasscode,setAdminPasscode] = useState("")
    const [adminState,setAdminState] = useState(0);
    const {errorObj, setErrorObj} = useContext(ErrorContext)

    const nullState = (
    <div>
        <input value={adminPasscode} onChange={(e)=>{
            setAdminPasscode(e.target.value)
        }} />
        <button onClick={(e)=>{
            apiRequest("http://localhost:8080/","",
            {
                option: 2000,
                passcode: adminPasscode
            },
            "POST").then((data)=>{
                if(data["code"]!=0){
                    props.setAdminState(1)
            } else{
                    setErrorObj({code:0,display:1,title:"Failed to Login",
                                    content:data["msg"]})
                }
            })
        }}>Login</button>
    </div>);
    const loginState = (
        <div>
            <div className='listRequests'>

            </div>
        </div>
    );

    return (
        <div id="adminPanelBody" onClick={(e)=>{e.stopPropagation()}}>
            <div id="adminPanelBodyCont">
                <div className='top_heading'>Admin Login</div>
                {adminState == 0 ? nullState :
                    loginState}
            </div>
        </div>
    )
}

export default Overlay