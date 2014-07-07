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
if(file_exists('../config.php') && file_get_contents('../config.php')!=''){
    include('check_logged.php');
    
    if($_POST['settings_password']=='#########'){
        $password = $config['user']['password'];
    }else{
        $password = $_POST['settings_password'];
    }
}else{
    $password = $_POST['settings_password'];
}

$new_config = array(
    'user' => array(
        'login' => $_POST['settings_login'],
        'password' => $password
    ),
    'interface_theme' => $_POST['interface_theme'],
    'code_theme' => $_POST['code_theme'],
    'sites' => array()
);

for($i=0;$i<count(@$_POST['ftp_name']);$i++){
    $password = $_POST['ftp_password'][$i];
    if($password=='#########'){
        for($y=0;$y<count($config['sites']);$y++){
            if($_POST['ftp_name'][$i]==$config['sites'][$y]['name']){
                $password = $config['sites'][$y]['password'];
                break;
            }
        }
    }
    $new_config['sites'][] = array(
        'name' => $_POST['ftp_name'][$i],
        'host' => $_POST['ftp_host'][$i],
        'port' => $_POST['ftp_port'][$i],
        'user' => $_POST['ftp_user'][$i],
        'password' => $password,
        'path' => $_POST['ftp_path'][$i],
    );
}

$config_content = '<?php'."\n".'$config = '.var_export($new_config,true).';'."\n".'?>';

if(@file_put_contents('../config.php',$config_content)){
    $new_config['user']['password'] = '#########';
    for($i=0;$i<count($new_config['sites']);$i++){
        $new_config['sites'][$i]['password'] = '#########';
    }
    print '{"status":"success","config":'.json_encode($new_config).'}';
}else{
    print '{"status":"error","message":"Impossible to save the configuration file"}';
}

?>