<?php
$array = array("firstname" => "", "name" => "", "email" => "", "phone" => "", "message" => "", "firstnameError" => "", "nameError" => "", "phoneError" => "", "messageError" => "","isSuccess" => false);

$emailto = "info.tutorexchange@gmail.com";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $array['firstname'] = verifyInput($_POST['firstname']);
    $array['name'] = verifyInput($_POST['name']);
    $array['email'] = verifyInput($_POST['email']);
    $array['phone'] = verifyInput($_POST['phone']);
    $array['message'] = verifyInput($_POST['message']);
    $array['isSuccess'] = true;
    $emailText = "";
    

    if (empty($array['firstname'])) {
        $array['firstnameError'] = "we need to know your name!";
        $array['isSuccess'] = false;
    }else{
        $emailText .= "firstname: {$array['firstname']}\n";
    }

    if (empty($array['name'])) {
        $array['nameError'] = "to ensure we don't have two of you!";
        $array['isSuccess'] = false;
    } else {
        $emailText .= "name: {$array['name']}\n";
    }

    if(!isEmail($array['email'])){
        $array['emailError'] = " this is not a valid email address!";
        $array['isSuccess'] = false;
    } else {
        $emailText .= "email: {$array['email']}\n";
    }

    if(!isPhone($array['phone'])){
        $array['phoneError'] = " only use numbers or spaces ( ) ";
        $array['isSuccess'] = false;
    } else {
        $emailText .= "phone: {$array['phone']}\n";
    }

    if (empty($array['message'])) {
        $array['messageError'] = "how can we help?";
        $array['isSuccess'] = false;
    } else {
        $emailText .= "message: {$array['message']}\n";
    }

    if($array['isSuccess']){
        $headers = "From: {$array['firstname']} {$array['name']} <{$array['email']}>\r\n\Reply-To: {$array['email']}";
        mail($emailto, "A message from TechServ U+000A9 2020",$emailText,$headers);
    }

    // Check if the form is submitted if ( isset( $_POST['submit'] ) ) { // retrieve the form data by using the element's name attributes value as key $firstname = $_POST['firstname']; $lastname = $_POST['lastname']; // display the results

    //echo '<h3>Form POST Method</h3>'; echo 'Your name is ' . $lastname . ' ' . $firstname; exit; }-->
    //The POST method form
}

    echo json_encode($array);
    //Encode the array into a JSON string.
//$encodedString = json_encode($array);
 
//Save the JSON string to a text file.
//file_put_contents('home/tyrone/Documents/json_array.txt', $encodedString);

//$json_array = fopen("home/tyrone/Documents/json_array.txt","w");
//fwrite($json_array, $array);
//fclose($json_array);

function verifyInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);

    return $data;
}

function isEmail($var){
    return filter_var($var, FILTER_VALIDATE_EMAIL);
}

function isPhone ($var){

    // expression régulière
    return preg_match("/^[0-9 ]*$/", $var);
}

?>