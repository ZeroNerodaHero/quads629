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
    $ret = '{"code":0}';
    if($option == 1){
        if(empty($hData["phoneNum"])){
            $ret = '{"code":0,"msg":"Please insert a valid phone number"}';    
        } else{
            $retOBJ = array("code"=>0);
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
