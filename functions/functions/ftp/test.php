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
$found = false;

if(!$ftp = @ftp_connect($_POST['host'],$_POST['port'])){
    print '{"status":"error","message":"Impossible to connect to the FTP server"}';
    exit;
}

if($_POST['password']=='#########'){
    include('../../config.php');
    foreach($config['sites'] as $site){
        if($site['name']==$_POST['name']){
            $_POST['password'] = $site['password'];
            break;
        }
    }
}

if(!@ftp_login($ftp,$_POST['user'],$_POST['password'])){
    print '{"status":"error","message":"Wrong user or password"}';
    ftp_close($ftp);
    exit;
}
@ftp_pasv($ftp,true);
if(ftp_nlist($ftp,$_POST['path'])===false){
    print '{"status":"error","message":"Not existing directory"}';
    ftp_close($ftp);
    exit;
}

print '{"status":"success","message":"FTP connection succeed!"}';

?>