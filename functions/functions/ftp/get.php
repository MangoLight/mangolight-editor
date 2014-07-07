<?php
/* ==========================================================
 * MangoLight Editor 0.1
 * http://www.mangolight.com/labs/mangolight_editor
 * ==========================================================
 * Copyright 2014 MangoLight / http://www.mangolight.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
include('../check_logged.php');
include('connect.php');

ob_start();
$result = ftp_get($ftp,"php://output",$_POST['file'],FTP_BINARY);

$data = ob_get_contents();
ob_end_clean();

if(!$result){
    print '{"status":"error","message":"Impossible to get the file","file":"'.$_POST['file'].'"}';
    exit;
}

$name = $_POST['file'];
if(strrpos($name,'/')!==false){
    $name = substr($name,strrpos($name,'/')+1);
}

$ext = strtolower(substr($name,strrpos($name,'.')+1));
$base64_ext = array('png','jpg','jpeg','gif','ico');

if(in_array($ext,$base64_ext)){
    $data = base64_encode($data);
}else{
    $data = htmlspecialchars($data);
}

$file = array('site'=>$site['name'],'file'=>$_POST['file'],'name'=>$name,'ext'=>$ext,'content'=>$data);

print '{"status":"success","file":'.json_encode($file).'}';

ftp_close($ftp);

?>