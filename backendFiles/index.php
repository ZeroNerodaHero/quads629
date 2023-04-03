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
        genNoParamInfo();
        die();
    }
    //search for a phone number
    //returns current as well as previous requests
    $ret = '{"code":0}';
    if($option == 1){
        if(empty($hData["phoneNum"])){
            $ret = '{"code":0,"msg":"Please insert a valid phone number"}';    
        } else{
            $retOBJ = array("code"=>0)
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
        if(empty($hData["first_name"]) || empty($hData["last_name"]) || 
            empty($hData["phoneNum"]) || empty($hData["email"]) || 
            empty($hData["locationX"]) || empty($hData["locationY"]) || 
            empty($hData["location_string"])
        ){
            $ret = '{"code":0,"msg":"Please fill the form completely"}';    
        } else{
            addRequest($hData["first_name"],$hData["last_name"],
                $hData["phoneNum"],$hData["email"],$hData["locationX"],
                $hData["locationY"],$hData["location_string"]);
        }
    }
    function addRequest($first_name,$last_name,$phoneNum,$email,$locationX,
        $locationY,$location_string){
            global $conn;
            $que = "INSERT INTO activeRequest(
                        first_name,last_name,phoneNum,email,locationX,
                        locationY,location_string)
                    VALUES('$first_name','$last_name','$phoneNum','$email',
                            '$locationX','$locationY','$location_string')";
            $conn->query();
    }
    echo $ret;
?>
