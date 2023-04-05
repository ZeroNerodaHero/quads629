<?php 
    header('Access-Control-Allow-Origin: *');    
    header('Access-Control-Allow-Headers:  *');
    header('Access-Control-Allow-Methods:  *'); 
    include_once("login.php");
    $hData = $_POST;
    if(empty($_POST)){
        $hData = json_decode(file_get_contents("php://input"),true);
    }

    //parameters
    //api-key requires
    $apiKey = "null";
    $option = empty($hData["option"]) ? 0:$hData["option"];

    if($option == 0){
        echo '{"code":0,"msg":"No command"}';
        die();
    }
    //search for a phone number
    //returns current as well as previous requests
    $ret = '{"code":0,"msg":"General Error"}';
    if($option == 1){
        if(empty($hData["phoneNum"])){
            $ret = '{"code":0,"msg":"Please insert a valid phone number"}';    
        } else{
            $retOBJ = array("code"=>0,"msg"=>"No Phone Number Found");
            $que = "SELECT * FROM activeRequest WHERE phoneNum=".$hData["phoneNum"];
            $res = $conn->query($que);
            if($res->num_rows != 0){
                $retOBJ["code"] = 1;
                $retOBJ["msg"] = "Valid";
                $retOBJ["activeRequest"] = $res->fetch_assoc();
            }
            $que = "SELECT * FROM oldRequest WHERE phoneNum=".$hData["phoneNum"];
            $res = $conn->query($que);
            if($res->num_rows != 0){
                $retOBJ["code"] = 1;
                $retOBJ["msg"] = "Valid";
                $retOBJ["oldRequest"] = array();
                while($row = $res->fetch_assoc()){
                    $retOBJ["oldRequest"][] = $row;
                }
            }
            $ret = json_encode($retOBJ);
        }
    }
    //creates a request
    else if($option == 2){
        if(empty($hData["name"]) || 
            empty($hData["phoneNum"]) || empty($hData["email"]) || 
            //empty($hData["locationX"]) || empty($hData["locationY"]) || 
            empty($hData["location"]) || empty($hData["descript"])
        ){
            $ret = '{"code":0,"msg":"Please fill the form completely"}';    
        } else{
            $code = addRequest($hData["name"],$hData["phoneNum"],$hData["email"],
                $hData["location"],$hData["descript"]);
            if($code == -1){
                $ret = '{"code":0,"msg":"You have a request already"}';    
            } else{
                $ret = json_encode(array("code"=>1,
                    "msg"=>"You have submited a request",
                    "id"=>$code));    
            }
        }
    }
    //change status of request
    else if($option == 1000){
        if(!empty($hData["id"]) && !empty($hData["new_status"])){
            $id = $hData["id"];
            $new_status = $hData["new_status"];
            if($new_status == 2){
                //finished
                $que = "SELECT * FROM activeRequest WHERE currentRequestId=$id";
                $res = $conn->query($que);
                if($res->num_rows > 0){
                    $row = $res->fetch_assoc();
                    $que = "INSERT INTO oldRequests(
                        name,phoneNum,email,locationX,locationY,location,
                        descript,request_time,requestId,invoiceTotal,invoiceString)
                        VALUES(
                            ".$row["name"].",
                            ".$row["phoneNum"].",
                            ".$row["email"].",
                            ".$row["locationX"].",
                            ".$row["locationY"].",
                            ".$row["location"].",
                            ".$row["descript"].",
                            ".$row["request_time"].",
                            ".$row["requestId"].",
                            ".$row["invoiceTotal"].",
                            ".$row["invoiceString"].")";
                    $conn->query($que);
                    $que = "DELETE FROM activeRequest WHERE currentRequestId=$id";
                    $conn->query($que);
                }
            } else{
                $que = "UPDATE activeRequest
                    SET status=$new_status
                    WHERE currentRequestId=$id";
                $conn->query($que);
            }
        } 
    }
    //add to expectedInvoiceString
    else if($option == 1001){
        if(!empty($hData["id"]) && !empty($hData["new_status"])){
            $id=$hData["id"];
            $new_string = $hData["new_status"];
            $que = "UPDATE activeRequest
                    SET invoiceString='$new_string'
                    WHERE currentRequestId=$id";
            $conn->query($que);
        }
    }
    else if($option == 2000){
        //TODO: make an authkey on the mysql server
        if(!empty($hData["passcode"])){
            $ret = $hData["passcode"] == "password" ?
                json_encode(array("code"=>1)) :
                json_encode(array("code"=>0,"msg"=>"wrong passcode")); 
        }
    }
    else if($option == 2001){
        $type = !empty($hData["type"]) && $hData["type"] == 1 ? "oldRequest" : "activeRequest"; 
        $que = "SELECT * FROM ".$type;
        $res = $conn->query($que);
        $retOBJ = array("code"=>1,"requests"=>array());
        while($row = $res->fetch_assoc()){
            $retOBJ["requests"][] = $row;
        }
        $ret = json_encode($retOBJ);
    }

    function addRequest($name,$phoneNum,$email,$location,$descript){
            global $conn;
            $que = "SELECT * FROM activeRequest WHERE phoneNUm='$phoneNum'";
            $res = $conn->query($que);
            if($res->num_rows == 0){
                $que = "INSERT INTO activeRequest(
                            name,phoneNum,email,location,descript)
                        VALUES('$name','$phoneNum','$email','$location','$descript')";
                $conn->query($que);
                return $conn->insert_id;
            } 
            return -1;
    }
    echo $ret;
?>
