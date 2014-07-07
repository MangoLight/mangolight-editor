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
var editors = [];
var theme = 'mangolight';
var mouse_pos = {x:0,y:0};
var clicked_element;

$(document).ready(function(){
    
    $(window).resize(function(){adapt_size()});
    $('#project_selector select').change(function(){update_file_browser()});
    $('#project_selector .fa-refresh').click(function(){update_file_browser()});
    
    $(document).on('click','.open_folder',function(){
        if($(this).hasClass('site')) return;
        clicked_element = $(this);
        var ul = $(this).parent().children('ul');
        if(ul.length===0){
            open_folder($(this).attr('data-file'));
        }else{
            if(ul.css('display')=='none'){
                ul.slideDown('fast');
                $(this).find('img').attr('src','public/img/icons/folder_opened.png');
            }else{
                ul.slideUp('fast');
                $(this).find('img').attr('src','public/img/icons/folder_closed.png');
            }
        }
    });
    
    $(document).on('click','.open_file',function(){
        clicked_element = $(this);
        open_file($('#project_selector select').val(),$(this).attr('data-file'));
    });
    
    $(document).on('contextmenu','.open_file',function(e){
        clicked_element = $(this);
        open_file_menu();
        e.preventDefault();
    });
    
    $(document).on('contextmenu','.open_folder',function(e){
        clicked_element = $(this);
        open_folder_menu();
        e.preventDefault();
    });
    
    $('#search_files').keyup(function(e){
        if(e.ctrlKey || e.altKey) return;
        
        if(e.keyCode==13){
            $('#browser .open_file').each(function(){
                if($(this).css('display')!='none'){
                    $(this).click();
                    e.preventDefault();
                }
            });
        }else{
            $('#browser .open_file').show();
            var s = $('#search_files').val();
            if(s===''){
                $('#browser .open_folder').show();
                $('#browser ul li').find('ul').hide();
                $('#browser ul li').find('ul').eq(0).show();
                $('#browser .open_folder').not('.site').find('img').attr('src','public/img/icons/folder_closed.png');
            }else{
                $('#browser .open_folder').not('.site').hide();
                $('#browser ul li').find('ul').eq(0).show();
                $('#browser .open_file,#browser .open_folder').not('.site').each(function(){
                    if($(this).attr('data-name').toLowerCase().indexOf(s.toLowerCase())==-1){
                        $(this).hide();
                    }else{
                        open_folders($(this).attr('data-file'));
                    }
                });
            }
        }
    });
    
    $(document).on('click','#tabs ul li',function(){
        open_tab($(this));
    });
    
    $(document).on('click','#tabs li .close',function(e){
        close_tab($(this).parent());
        e.stopPropagation();
    });
    
    $('#functions_search input').keyup(function(e){
        if(e.keyCode==13){
            $('#functions li').each(function(){
                if($(this).css('display')!='none'){
                    $(this).click();
                    return false;
                }
            });
        }else{
            filter_functions();
        }
    });
    
    $(document).on('click','#functions li',function(){
        var line = (parseInt($(this).attr('data-line'))+1);
        var e = current_editor();
        e.gotoLine(line);
        e.scrollToLine(e.selection.getCursor().row-3);
        e.focus();
    });
    
    $(document).keyup(function(e){
        // Space, Enter, Tab or Comma = show autocompleter
        if(e.altKey || e.ctrlKey || $('input:focus').length) return;
        
        if(e.keyCode>=65 && e.keyCode<=90){
            if($('.ace_autocomplete').length==0 || $('.ace_autocomplete').css('display')=='none'){
                current_editor().execCommand("startAutocomplete");
            }
        }
    });
    
    $(document).keydown(function(e){
        
        // Ctrl + S = Upload file
        if(e.keyCode==83 && e.ctrlKey){
            save_file();
            e.preventDefault();
        }
        
        // Ctrl + Shift + F = Focus file search box
        if(e.keyCode==70 && e.ctrlKey && e.shiftKey){
            $('#search_files').select().focus();
            e.preventDefault();
        }
        
        // Ctrl + Q = Go to functions search
        if(e.keyCode==81 && e.ctrlKey){
            $('#functions_search input').select().focus();
            e.preventDefault();
        }
        
        // Alt + F = Focus mode
        if(e.keyCode==70 && e.altKey){
            //if($('#tabs li').length>0){
                if($('#editors').hasClass('fullmode')){
                    $('#tabs').removeClass('fullmode');
                    $('#editors').removeClass('fullmode');
                    adapt_size();
                    // Prevent overflow
                    $('.editor').each(function(){
                        if(($(this).width()+$(this).offset().left)>$('#functions').offset().left){
                            $(this).width($('#functions').offset().left-$(this).offset().left-10);
                        }
                    });
                }else{
                    $('#tabs').addClass('fullmode');
                    $('#editors').addClass('fullmode');
                    adapt_size();
                }
            //}
            e.preventDefault();
        }
        
        // Alt + A = Switch to next tab
        if(e.keyCode==65 && e.altKey){
            if(e.shiftKey){
                if($('#tabs li.active').prev('li').length){
                    $('#tabs li.active').prev('li').click();
                }else{
                    $('#tabs li').last().click();
                }
            }else{
                if($('#tabs li.active').next('li').length){
                    $('#tabs li.active').next('li').click();
                }else{
                    $('#tabs li').first().click();
                }
            }
            e.preventDefault();
        }
        
        // Alt + M = maximize toggle
        if(e.keyCode==77 && e.altKey){
            $('.editor.active').find('.maximize').click();
            e.preventDefault();
        }
        
        // Alt + Q = Close tab
        if(e.keyCode==81 && e.altKey){
            close_tab($('#tabs li.active'));
            e.preventDefault();
        }
        
    });
    
    $(document).mousemove(function(e){
        mouse_pos.x = e.pageX;
        mouse_pos.y = e.pageY;
    });
    
    $('#layer').hide().click(function(){
        hide_menu();
    }).contextmenu(function(e){
        hide_menu();
        e.preventDefault();
    });
    
    $('.new_folder').click(function(){
        new_folder();
    });
    
    $('.new_file').click(function(){
        new_file();
    });
    
    $('.delete_file').click(function(){
        hide_menu();
        if(confirm('Are you sure to delete '+clicked_element.attr('data-name')+'?')){
            log('Deleting file '+clicked_element.attr('data-file')+'...');
            var site = $('#project_selector select').val();
            var file = clicked_element.attr('data-file');
            $.ajax({
                url: base_url+'functions/ftp/delete.php',
                data: {'site':site,'file':file},
                type: 'post',
                dataType: 'json',
                success: function(data){
                    if(data.status=='success'){
                        clicked_element.parent().remove();
                        log('File '+data.file+' deleted','success');
                        var tab = $('#tabs li[data-file="'+data.file+'"][data-site="'+$('#project_selector select').val()+'"]');
                        if(tab.length>0){
                            close_tab(tab);
                        }
                    }else if(data.message=='Not logged'){
                        show_login_form();
                    }else{
                        log('ERROR: Deleting file failed','error');
                        log(data.message,'error');
                    }
                },
                error: function(data){
                    log('ERROR: Deleting file failed','error');
                    log(data.message,'error');
                }
            });
        }
    });
    
    $('.delete_folder').click(function(){
        hide_menu();
        if(clicked_element.hasClass('site')){
            alert('Impossible to rename root directory, edit configuration instead.');
            return;
        }
        if(confirm('Are you sure to delete '+clicked_element.attr('data-name')+'?')){
            log('Deleting folder '+clicked_element.attr('data-file')+'...');
            var site = $('#project_selector select').val();
            var folder = clicked_element.attr('data-file');
            $.ajax({
                url: base_url+'functions/ftp/rmdir.php',
                data: {'site':site,'folder':folder},
                type: 'post',
                dataType: 'json',
                success: function(data){
                    if(data.status=='success'){
                        clicked_element.parent().remove();
                        log('Folder '+data.folder+' deleted','success');
                        var tabs = $('#tabs li[data-file^="'+data.folder+'"][data-site="'+$('#project_selector select').val()+'"]');
                        tabs.each(function(){
                            close_tab($(this));
                        });
                    }else if(data.message=='Not logged'){
                        show_login_form();
                    }else{
                        log('ERROR: Deleting folder failed','error');
                        log(data.message,'error');
                    }
                },
                error: function(data){
                    log('ERROR: Deleting folder failed','error');
                    log(data.message,'error');
                }
            });
        }
    });
    
    $('.rename').click(function(){
        rename();
    });
    
    $('.upload').click(function(){
        hide_menu();
        $('#upload_form input[name="folder"]').attr('value',clicked_element.attr('data-file'));
        $('#upload_form input[name="site"]').attr('value',$('#project_selector select').val());
        $('#upload_form input[type="file"]').click();
    });
    
    $('#upload_form input[type="file"]').change(function(){
        log('Uploading file '+$(this).val()+'...');
        $('#upload_form').submit();
    });
    
    $('.download').click(function(){
        hide_menu();
        $('<iframe>').hide().attr('src',base_url+'functions/ftp/download.php?site='+$('#project_selector select').val()+'&file='+encodeURIComponent(clicked_element.attr('data-file'))).appendTo('body');
    });
    
    $(document).on('click','.editor',function(){
        if(!$(this).hasClass('active'))
            open_tab($('#tabs li[data-file="'+$(this).attr('data-file')+'"][data-site="'+$(this).attr('data-site')+'"]'));
    });
    
    $(document).on('click','.bar .close',function(e){
        close_tab($('#tabs li[data-file="'+$(this).parent().parent().attr('data-file')+'"][data-site="'+$(this).parent().parent().attr('data-site')+'"]'));
        e.stopPropagation();
    });
    
    $(document).on('click','.bar .maximize',function(e){
        var w = $(this).parent().parent();
        if(!w.hasClass('active'))
            open_tab($('#tabs li[data-file="'+w.attr('data-file')+'"][data-site="'+w.attr('data-site')+'"]'));
        if(!w.attr('data-position')){
            w.attr('data-width',w.width());
            w.attr('data-height',w.height());
            w.attr('data-top',w.css('top'));
            w.attr('data-left',w.css('left'));
        }
        if(w.attr('data-position')=='maximized'){
            w.animate({'width':w.attr('data-width'),'height':w.attr('data-height'),'top':w.attr('data-top'),'left':w.attr('data-left')},'fast',function(){
                resize_window(w);
            }).attr('data-position','');
        }else{
            w.animate({'width':'100%','height':'100%','top':0,'left':0},'fast',function(){
                resize_window(w);
            }).attr('data-position','maximized');
        }
        e.stopPropagation();
    });
    
    $(document).on('click','.bar .to_left',function(e){
        var w = $(this).parent().parent();
        if(!w.hasClass('active'))
            open_tab($('#tabs li[data-file="'+w.attr('data-file')+'"][data-site="'+w.attr('data-site')+'"]'));
        if(!w.attr('data-position')){
            w.attr('data-width',w.width());
            w.attr('data-height',w.height());
            w.attr('data-top',w.css('top'));
            w.attr('data-left',w.css('left'));
        }
        if(w.attr('data-position')=='to_left'){
            w.animate({'width':w.attr('data-width'),'height':w.attr('data-height'),'top':w.attr('data-top'),'left':w.attr('data-left')},'fast',function(){
                resize_window(w);
            }).attr('data-position','');
        }else{
            w.animate({'width':'50%','height':'100%','top':0,'left':0},'fast',function(){
                resize_window(w);
            }).attr('data-position','to_left');
        }
        e.stopPropagation();
    });
    
    $(document).on('click','.bar .to_right',function(e){
        var w = $(this).parent().parent();
        if(!w.hasClass('active'))
            open_tab($('#tabs li[data-file="'+w.attr('data-file')+'"][data-site="'+w.attr('data-site')+'"]'));
        if(!w.attr('data-position')){
            w.attr('data-width',w.width());
            w.attr('data-height',w.height());
            w.attr('data-top',w.css('top'));
            w.attr('data-left',w.css('left'));
        }
        if(w.attr('data-position')=='to_right'){
            w.animate({'width':w.attr('data-width'),'height':w.attr('data-height'),'top':w.attr('data-top'),'left':w.attr('data-left')},'fast',function(){
                resize_window(w);
            }).attr('data-position','');
        }else{
            w.animate({'width':'50%','height':'100%','top':0,'left':'50%'},'fast',function(){
                resize_window(w);
            }).attr('data-position','to_right');
        }
        e.stopPropagation();
    });
    
    $(document).on('click','.bar .minimize',function(e){
        var w = $(this).parent().parent();
        w.fadeOut('fast',function(){
            if(w.hasClass('active')){
                $('#tabs li.active').removeClass('active');
                show_previous_window();
            }
        });
        e.stopPropagation();
    });
    
    $('#login_form').submit(function(e){
        $.ajax({
            url: base_url + 'functions/check_logged.php',
            data: $(this).serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    if($('#browser ul').html()=='') update_file_browser();
                    if($('#tabs ul').html()=='') load_previous_files();
                    $('#login_layer').hide();
                    log('Logged','success');
                }else{
                    // Border RED
                    $('#login_form input').css('border-color','darkred');
                }
            },
            error: function(data){
                $('#login_form input').css('border-color','red');
            }
        });
        e.preventDefault();
    });
    
    $('.browser').click(function(){
        var url = prompt('URL to load:','http://');
        if(!url) return;
        open_browser(url,confirm('Reload every 10 seconds?'));
    });
    
    $('.settings').click(function(){
        show_settings_form();
        $('#settings_form .cancel').show();
    });
    
    $('#settings_form .cancel').click(function(e){
        $('#settings_layer').fadeOut('fast');
        e.preventDefault()
    });
    
    $('.add_ftp').click(function(e){
        $('#settings_form table tbody').append(ftp_tr('','','21','','',''));
        $('#settings_form table tbody').scrollTop(99999999999);
        e.preventDefault();
    });
    
    $(document).on('click','.test_ftp',function(){
        var tr = $(this).parent().parent();
        var name = tr.find('[name="ftp_name[]"]').val();
        var host = tr.find('[name="ftp_host[]"]').val();
        var port = tr.find('[name="ftp_port[]"]').val();
        var user = tr.find('[name="ftp_user[]"]').val();
        var password = tr.find('[name="ftp_password[]"]').val();
        var path = tr.find('[name="ftp_path[]"]').val();
        
        $.ajax({
            url: base_url + 'functions/ftp/test.php',
            async: false,
            data: {'name':name,'host':host,'port':port,'user':user,'password':password,'path':path},
            type: 'post',
            dataType: 'json',
            success: function(data){
                alert(data.message);
            },
            error: function(data){
                alert('Error testing FTP');
            }
        });
    });
    
    $(document).on('click','.remove_ftp',function(){
        if($('#settings_form tbody tr').length<2){
            alert('You must to have at least one FTP connexion.');
            return;
        }
        if(confirm('Are you sure you want to remove this FTP connexion?'))
            $(this).parent().parent().remove();
    });
    
    $('#settings_form').submit(function(e){
        e.preventDefault();
    });
    
    $('#settings_form .save').click(function(e){
        save_settings();
        e.preventDefault();
    });
    
    $('.about').click(function(){
        $('#about_layer').fadeIn('fast');
    });
    
    $('#about_layer .cancel').click(function(){
        $('#about_layer').fadeOut('fast');
    });
    
    $('#tabs ul').sortable({
        update: function(){
            reset_previous_files();
        }
    });
    
    adapt_size();
    load_previous_config();
    check_logged();
    setInterval(function(){
        check_logged();
    },30000);
    setInterval(function(){
        $('.content.browser').each(function(){
            if($(this).parent().attr('data-site').indexOf('_reload')!=-1)
                $(this).find('iframe').attr('src',$(this).parent().attr('data-file'));
        })
    },10000);
});

function adapt_size(){
    /*$('#search_files').width($('#browser').width()-33);
    $('#functions_search input').width($('#functions').width()-36);*/
    $('#project_selector select').css('width',$('#browser').width()-23);
    $('#editors').css('width',$(window).width()-$('#browser').width()-$('#functions').width()-130);
    $('#tabs').css('left','14%');
    $('#tabs.fullmode').css('left',0);
    $('#editors').css('left',$('#browser').width()+130);
    $('#editors.fullmode').css({'left':130,'width':$(window).width()-130-$('#functions').width()});
    $('#editors').css('width',$('#editors').width()-10);
    $('.ace_editor').each(function(){
        $(this).height($(this).parent().height()-25);
    });
    for(var i=0;i<editors.length;i++){
        editors[i].editor.resize();
        editors[i].editor.renderer.updateFull();
        try{
            editors[i].editor.scrollToLine(editors[i].editor.selection.getCursor().row-10);
        }catch(e){}
    }
}

function resize_window(w){
    w.find('.ace_editor').height(w.height()-25);
    try{
        var e = current_editor();
        e.resize();
        e.renderer.updateFull();
        e.scrollToLine(e.selection.getCursor().row-10);
        e.focus();
    }catch(e){}
}

function open_file(site,file){
    // Check if tab already opened or open file
    if($('#tabs li[data-file="'+file+'"][data-site="'+site+'"]').length>0){
        // Go to tab
        $('#tabs li[data-file="'+file+'"][data-site="'+site+'"]').click();
        log('Switching to file '+file);
    }else{
        // Get file content
        log('Loading file '+site+'://'+file+'...');
        $.ajax({
            url: base_url+'functions/ftp/get.php',
            async: false,
            data: {'site':site,'file':file},
            type: 'post',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    var id = data.file.site.replace(/[^-A-Za-z0-9]+/g,'_')+'__'+data.file.file.replace(/[^-A-Za-z0-9]+/g,'_');
                    $('#tabs ul').append('<li style="background:'+get_color(data.file.ext)+'" title="'+data.file.site+'://'+data.file.file+'" data-name="'+data.file.name+'" data-file="'+data.file.file+'" data-editor="'+id+'" data-site="'+data.file.site+'">'+data.file.name+'<span title="Close" class="close"><i class="fa fa-times"></i></span></li>');
                    var bar = $('<div>').addClass('bar').css('background',get_color(data.file.ext)).append($('<div>').addClass('window_title').text(data.file.site+'://'+data.file.file).attr('title',cut_title(data.file.site+'://'+data.file.file))).append($('<span>').addClass('button minimize').html('<i class="fa fa-minus"></i>')).append($('<span>').addClass('button to_left').html('<i class="fa fa-angle-left"></i>').attr('title','Align left')).append($('<span>').addClass('button to_right').html('<i class="fa fa-angle-right"></i>').attr('title','Align right')).append($('<span>').addClass('button maximize').html('<i class="fa fa-plus"></i>').attr('title','Maximize')).append($('<span>').addClass('button close').html('<i class="fa fa-times"></i>').attr('title','Close'));
                    
                    if(data.file.ext=='png'||data.file.ext=='jpg'||data.file.ext=='jpeg'||data.file.ext=='gif'||data.file.ext=='ico'){
                        var image = $('<div>').attr('id',id).addClass('content image_viewer').html('<img style="max-width:100%;max-height:100%;" src="data:image/jpg;base64,'+data.file.content+'"/>');
                        $('#editors .container').append($('<div>').addClass('editor').attr('data-file',data.file.file).attr('data-site',data.file.site).append(bar).append(image));
                        
                    }else{
                        var ace_editor = $('<div>').attr('id',id).addClass('content ace_editor').html(data.file.content);
                        
                        $('#editors .container').append($('<div>').addClass('editor').attr('data-file',data.file.file).attr('data-site',data.file.site).append(bar).append(ace_editor));
                        var langTools = ace.require("ace/ext/language_tools");
                        var editor = ace.edit(id);
                        editors.push({'id':id,'editor':editor});
                        editor.setTheme('ace/theme/'+theme);
                        editor.renderer.lineHeight = 17;
                        editor.setOptions({
                            enableBasicAutocompletion:true,
                            enableSnippets: true
                        });
                        editor.setShowInvisibles(true);
                        editor.getSession().setUseWrapMode(true);
                        editor.setShowPrintMargin(false);
                        
                        var modes = [{'abap':'abap'},{'as':'actionscript'},{'ada':'ada'},{'conf':'apache_conf'},{'applescript':'applescript'},{'asc':'asciidoc'},{'ad':'asciidoc'},{'asm':'assembly_x86'},{'ahk':'autohotkey'},{'bat':'batchfile'},{'c9search_results':'c9search'},{'c':'c_cpp'},{'cpp':'c_cpp'},{'cirru':'cirru'},{'clj':'clojure'},{'cbl':'cobol'},{'coffee':'coffee'},{'cfm':'coldfusion'},{'cs':'csharp'},{'css':'css'},{'curly':'curly'},{'dart':'dart'},{'diff':'diff'},{'django':'django'},{'d':'d'},{'dockerfile':'dockerfile'},{'dot':'dot'},{'ejs':'ejs'},{'erl':'erlang'},{'frt':'forth'},{'ftl':'ftl'},{'feature':'gherkin'},{'glsl':'glsl'},{'go':'golang'},{'groovy':'groovy'},{'haml':'haml'},{'hbs':'handlebars'},{'hs':'haskell'},{'axe':'axe'},{'html':'html'},{'erb':'html_ruby'},{'ini':'ini'},{'jack':'jack'},{'jade':'jade'},{'java':'java'},{'js':'javascript'},{'jq':'jsoniq'},{'json':'json'},{'jsp':'jsp'},{'jsx':'jsx'},{'jl':'julia'},{'tex':'latex'},{'less':'less'},{'liquid':'liquid'},{'lisp':'lisp'},{'ls':'livescript'},{'logic':'logiql'},{'lsl':'lsl'},{'lua':'lua'},{'lp':'luapage'},{'lucene':'lucene'},{'make':'makefile'},{'md':'markdown'},{'matlab':'matlab'},{'mel':'mel'},{'mc':'mushcode'},{'mysql':'mysql'},{'nix':'nix'},{'m':'objectivec'},{'ml':'ocaml'},{'pas':'pascal'},{'pl':'perl'},{'pgsql':'pgsql'},{'php':'php'},{'txt':'plain_text'},{'ps1':'powershell'},{'plg':'prolog'},{'properties':'properties'},{'proto':'protobuf'},{'py':'python'},{'rd':'rdoc'},{'rhtml':'rhtml'},{'r':'r'},{'rb':'ruby'},{'rs':'rust'},{'sass':'sass'},{'scad':'scad'},{'scala':'scala'},{'scm':'scheme'},{'scss':'scss'},{'sh':'sh'},{'sjs':'sjs'},{'smarty':'smarty'},{'snippets':'snippets'},{'soy':'soy_template'},{'space':'space'},{'sql':'sql'},{'styl':'stylus'},{'svg':'svg'},{'tcl':'tcl'},{'tex':'tex'},{'textile':'textile'},{'tmsnippet':'tmsnippet'},{'toml':'toml'},{'twig':'twig'},{'ts':'typescript'},{'vala':'vala'},{'vbs':'vbscript'},{'vm':'velocity'},{'v':'verilog'},{'vhd':'vhdl'},{'xml':'xml'},{'xq':'xquery'},{'yaml':'yaml'}];
                        
                        var mode = 'plain_text';
                        for(var i=0;i<modes.length;i++){
                            if(modes[i][data.file.ext]){
                                mode = modes[i][data.file.ext];
                                break;
                            }
                        }
                        editor.getSession().setMode("ace/mode/"+mode);
                        editor.on('change',function(){
                            if($('#tabs li[data-editor="'+id+'"]').text().indexOf('*')==-1){
                                $('#tabs li[data-editor="'+id+'"]').html($('#tabs li[data-editor="'+id+'"]').attr('data-name')+'<sup>*</sup><span title="Close" class="close"><i class="fa fa-times"></i></span>');
                                $('#'+id).parent().find('.bar .window_title').html($('#'+id).parent().find('.bar .window_title').text()+'<sup>*</sup>');
                            }
                            update_functions(editor);
                        });
                    }
                    
                    $('#tabs li[data-editor="'+id+'"]').click();
                    log('File '+data.file.name+' loaded','success');
                    add_previous_file(site,data.file.file);
                    
                    var editor_div = $('#'+id).parent();
                    editor_div.resizable({
                        start: function(){
                            if(!$(this).hasClass('active'))
                                $('#tabs li[data-file="'+$(this).attr('data-file')+'"]').click();
                            $(this).attr('data-position','');
                        },
                        resize:function(event,ui){
                            resize_window($(this));
                        },
                        minHeight: 150,
                        minWidth: 200,
                        containment: '#editors .container',
                        //grid: 10,
                        handles: 'n,e,s,w,ne,nw,se,sw'
                    });
                    resize_window(editor_div);
                    editor_div.draggable({
                        start: function(){
                            $(this).find('.bar').addClass('grabbing');
                            if(!$(this).hasClass('active'))
                                $('#tabs li[data-file="'+$(this).attr('data-file')+'"]').click();
                        },
                        stop: function(){
                            $(this).find('.bar').removeClass('grabbing');
                        },
                        handle: '.bar',
                        containment: '#editors .container'
                        //grid: [ 10, 10 ]
                    });
                    
                    editor_div.css({'top':$('.editor').length*20,'left':$('.editor').length*20})
                    if( (editor_div.width()+editor_div.offset().left) > $('#functions').offset().left
                     || (editor_div.height()+editor_div.offset().top) > $(window).height() ){
                         editor_div.css({'top':0,'left':0});
                    }
                    
                }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                    log('ERROR: Loading file failed','error');
                    log(data.message,'error');
                    remove_previous_file(site,data.file);
                }
            },
            error: function(data){
                log('ERROR: Loading file failed','error');
                log(data.message,'error');
                remove_previous_file(site,data.file);
            }
        });
    }
}

function open_browser(url,reload){
    var site = 'mangolight_editor_browser';
    if(reload) site += '_reload';
    if($('#tabs li[data-file="'+url+'"][data-site="'+site+'"]').length>0){
        $('#tabs li[data-file="'+url+'"][data-site="'+site+'"]').click();
        log('Switching to file '+url);
    }else{
        var id = site+url.replace(/[^-A-Za-z0-9]+/g,'_');
        $('#tabs ul').append('<li title="'+url+'" data-name="'+url+'" data-file="'+url+'" data-editor="'+id+'" data-site="'+site+'">'+url+'<span title="Close" class="close"><i class="fa fa-times"></i></span></li>');
        var bar = $('<div>').addClass('bar').append($('<div>').addClass('window_title').text(url).attr('title',cut_title(url))).append($('<span>').addClass('button minimize').html('<i class="fa fa-minus"></i>')).append($('<span>').addClass('button to_left').html('<i class="fa fa-angle-left"></i>').attr('title','Align left')).append($('<span>').addClass('button to_right').html('<i class="fa fa-angle-right"></i>').attr('title','Align right')).append($('<span>').addClass('button maximize').html('<i class="fa fa-plus"></i>').attr('title','Maximize')).append($('<span>').addClass('button close').html('<i class="fa fa-times"></i>').attr('title','Close'));
        var browser = $('<div>').attr('id',id).addClass('content browser').html('<iframe src="'+url+'"></iframe>');
        $('#editors .container').append($('<div>').addClass('editor').attr('data-file',url).attr('data-site',site).append(bar).append(browser));
        
        $('#tabs li[data-editor="'+id+'"]').click();
        var editor_div = $('#'+id).parent();
        add_previous_file(site,url);
        editor_div.resizable({
            start: function(){
                if(!$(this).hasClass('active'))
                    $('#tabs li[data-file="'+$(this).attr('data-file')+'"]').click();
                $(this).attr('data-position','');
            },
            resize:function(event,ui){
                resize_window($(this));
            },
            minHeight: 200,
            minWidth: 300,
            containment: '#editors .container',
            //grid: 10,
            handles: 'n,e,s,w,ne,nw,se,sw'
        });
        resize_window(editor_div);
        editor_div.draggable({
            start: function(){
                $(this).find('.bar').addClass('grabbing');
                if(!$(this).hasClass('active'))
                    $('#tabs li[data-file="'+$(this).attr('data-file')+'"]').click();
            },
            stop: function(){
                $(this).find('.bar').removeClass('grabbing');
            },
            handle: '.bar',
            containment: '#editors .container'
            //grid: [ 10, 10 ]
        });
        editor_div.css({'top':$('.editor').length*20,'left':$('.editor').length*20})
        if( (editor_div.width()+editor_div.offset().left) > $('#functions').offset().left
         || (editor_div.height()+editor_div.offset().top) > $(window).height() ){
             editor_div.css({'top':0,'left':0});
        }
    }
}

function cut_title(title){
    if(title.length>63){
        return '...'+title.substring(title.length-60);
    }
    return title;
}

function open_tab(tab){
    $('#tabs .active').removeClass('active');
    tab.addClass('active');
    focus_window($('#'+tab.attr('data-editor')).parent());
    $('#functions_search input').val('');
    try{
        var e = get_editor(tab.attr('data-editor'));
        setTimeout(function(){update_functions(e)},200);
        adapt_size();
        e.focus();
    }catch(e){}
    log('Switching to file '+tab.attr('data-name'));
}

function focus_window(win){
    var max_zindex = 0;
    $('.editor').each(function(){
        if(parseInt($(this).css('z-index'))>max_zindex){
            max_zindex = parseInt($(this).css('z-index'));
        }
    });
    $('.editor.active').removeClass('active');
    win.css('z-index',max_zindex+1).addClass('active');
    win.fadeIn('fast');
}

function close_tab(tab,no_message){
    if(tab.length==0) return;
    if(tab.find('sup').length>0 && !no_message){
        if(!confirm('Changes are not saved, are you sure you want to close?')) return;
    }
    var name = tab.attr('data-name');
    $('#'+tab.attr('data-editor')).parent().remove();
    for(var i=0;i<editors.length;i++){
        if(editors[i].id==tab.attr('data-editor')){
            editors.splice(i,1);
        }
    }
    remove_previous_file(tab.attr('data-site'),tab.attr('data-file'));
    tab.remove();
    $('#functions ul').html('');
    log('File '+name+' closed');
    
    if($('#tabs .active').length===0){
        show_previous_window();
    }
}

function show_previous_window(){
    var max_zindex = 0;
    var tab;
    $('.editor').each(function(){
        if(parseInt($(this).css('z-index'))>max_zindex && $(this).css('display')!='none'){
            max_zindex = parseInt($(this).css('z-index'));
            tab = $('#tabs li[data-file="'+$(this).attr('data-file')+'"]');
        }
    });
    if(tab) tab.click();
}

function new_folder(){
    hide_menu();
    var name = prompt('Folder name :');
    if(name!==null && name!==''){
        name = clicked_element.attr('data-file')+'/'+name;
        log('Creating folder '+name+'...');
        var site = $('#project_selector select').val();
        $.ajax({
            url: base_url+'functions/ftp/mkdir.php',
            data: {'site':site,'folder':name},
            type: 'post',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    log('Folder '+data.folder+' created','success');
                    var folder = $('#browser span[data-file="'+data.parent+'"]');
                    folder.parent().find('ul').remove();
                    open_folder(data.parent);
                }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                    log('ERROR: Creating folder failed','error');
                    log(data.message,'error');
                }
            },
            error: function(data){
                log('ERROR: Creating folder failed','error');
                log(data.message,'error');
            }
        });
    }
}

function new_file(){
    hide_menu();
    var name = prompt('File name:');
    if(name!==null && name!==''){
        name = clicked_element.attr('data-file')+'/'+name;
        log('Creating file '+name+'...');
        var site = $('#project_selector select').val();
        $.ajax({
            url: base_url+'functions/ftp/save.php',
            data: {'site':site,'file':name,'content':''},
            type: 'post',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    log('File '+data.file+' created','success');
                    var folder = $('#browser span[data-file="'+data.folder+'"]');
                    folder.parent().find('ul').remove();
                    open_folder(data.folder);
                    open_file(site,data.file);
                }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                    log('ERROR: Creating file failed','error');
                    log(data.message,'error');
                }
            },
            error: function(data){
                log('ERROR: Creating file failed','error');
                log(data.message,'error');
            }
        });
    }
}

function rename(){
    hide_menu();
    if(clicked_element.hasClass('site')){
        alert('Impossible to rename root directory, edit config.php instead.');
        return;
    }
    var file = clicked_element.attr('data-file');
    var tab = $('#tabs li[data-file="'+file+'"][data-site="'+$('#project_selector select').val()+'"]');
    if(tab.length>0 && tab.find('sup').length>0){
        if(!confirm('Unsaved changes will be lost, are you sure?'))
            return;
    }
    //file = file.substring(file.indexOf('/')+1);
    var new_name = prompt('New name:',file);
    if(new_name!==null && new_name!==''){
        log('Renaming file/folder '+clicked_element.attr('data-file')+'...');
        var site = $('#project_selector select').val();
        $.ajax({
            url: base_url+'functions/ftp/rename.php',
            data: {'site':site,'file':file,'new_file':new_name},
            type: 'post',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    log('File/Folder '+data.file+' renamed','success');
                    var tabs = $('#tabs li[data-file="'+data.old_file+'"][data-site="'+$('#project_selector select').val()+'"]');
                    if(clicked_element.hasClass('open_file') && tabs.length==1){
                        open_file(site,data.file);
                    }
                    tabs.each(function(){
                        close_tab($(this),true);
                    });
                    $('#browser span[data-file="'+data.old_file+'"]').parent().remove();
                    var folder = $('#browser span[data-file="'+data.folder+'"]');
                    folder.parent().find('ul').remove();
                    open_folder(data.folder);
                }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                    log('ERROR: Renaming file/folder failed','error');
                    log(data.message,'error');
                }
            },
            error: function(data){
                log('ERROR: Renaming file/folder failed','error');
                log(data.message,'error');
            }
        });
    }
}

function get_editor(id){
    for(var i=0;i<editors.length;i++){
        if(editors[i].id==id){
            return editors[i].editor;
        }
    }
    return null;
}

function current_editor(){
    return get_editor($('#tabs .active').attr('data-editor'));
}

function open_file_menu(){
    display_layer();
    $('#file_menu').css({'top':mouse_pos.y,'left':mouse_pos.x}).fadeIn('fast');
    if(($('#file_menu').offset().top+$('#file_menu').height())>$(window).height()){
        console.log('cas');
        $('#file_menu').css({'top':mouse_pos.y-$('#file_menu').height()});
    }
}

function open_folder_menu(){
    display_layer();
    $('#folder_menu').css({'top':mouse_pos.y,'left':mouse_pos.x}).fadeIn('fast');
    if(($('#folder_menu').offset().top+$('#folder_menu').height())>$(window).height()){
        $('#folder_menu').css({'top':mouse_pos.y-$('#folder_menu').height()});
    }
}

function display_layer(){
    $('#layer').show();
}

function hide_menu(){
    $('#layer').hide();
    $('.menu').hide();
}

function save_file(){
    var tab = $('#tabs .active');
    var file = tab.attr('data-file');
    log('Saving file '+file+'...');
    var site = tab.attr('data-site');
    var editor = get_editor(tab.attr('data-editor'));
    if(editor!==null){
        var content = editor.getValue();
        $.ajax({
            url: base_url + 'functions/ftp/save.php',
            data: {'site':site,'file':file,'content':content},
            type: 'post',
            dataType: 'json',
            success: function(data){
                if(data.status=='success'){
                    $('#tabs li[data-file="'+data.file+'"][data-site="'+site+'"] sup').remove();
                    $('.editor[data-file="'+data.file+'"][data-site="'+site+'"]').find('sup').remove();
                    log('File '+data.file+' saved','success');
                }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                    log('ERROR: Saving file failed','error');
                    log(data.message,'error');
                }
            },
            error: function(data){
                log('ERROR: Saving file failed','error');
                log(data.message,'error');
            }
        });
    }else{
        log('ERROR: Editor not found','error');
    }
}

function update_functions(editor){
    $('#functions ul').html('');
    try{
        var Search = require('ace/search').Search;
        var mode = editor.getSession().getMode().$id;
        var suffix,needle = '';
        if(mode=="ace/mode/php" || mode=="ace/mode/javascript"){
            needle = '([a-zA-Z0-9_]+)[ ]?=[ ]?function|function ([a-zA-Z0-9_]+)';
            suffix = '()';
        }else if(mode=="ace/mode/css"){
            needle = '(.*){';
            suffix = '';
        }
        
        var search = new Search().set({needle:needle,regExp:true});
        var results = search.findAll(editor.getSession());
        
        if(!results.length){
            setTimeout(function(){update_functions(current_editor())},1000);
            return;
        }
        
        for(var i=0;i<results.length;i++){
            var r = results[i];
            var text = editor.getSession().doc.getTextRange({start:{column:r.start.column,row:r.start.row},end:{column:r.end.column,row:r.end.row}});
            text = text.replace(/( {|function |[ ]?=[ ]?function)/g,'');
            $('<li>').attr('data-line',r.start.row).attr('title',text+suffix).text(text+suffix).appendTo('#functions ul');
        }
        filter_functions();
    }catch(e){}
}

function filter_functions(){
    var s = $('#functions_search input').val()
    $('#functions li').show();
    $('#functions li').each(function(){
        if($(this).text().toLowerCase().indexOf(s.toLowerCase())==-1){
            $(this).hide();
        }
    });
}

function update_file_browser(file){
    $('#search_files').val('');
    var site = $('#project_selector select').val();
    $('#browser ul').html('');
    log('Loading project '+site+'...');
    $.ajax({
        url: base_url + 'functions/ftp/list.php',
        async: false,
        data: {'site':site,'folder':'/'},
        type: 'post',
        dataType: 'json',
        success: function(data){
            if(data.status=='success'){
                $('#browser ul').html('<li><span class="open_folder site" title="'+site+'" data-file="'+data.folder+'" data-name=""><img src="public/img/icons/folder_remote.png"/> '+site+'</span><ul></ul></li>');
                $('#browser ul li ul').append(file_hierarchy(data.files));
                $('#browser ul li').find('ul').hide();
                $('#browser ul li').find('ul').eq(0).show();
                $('#browser .open_folder').not('.site').find('img').attr('src','public/img/icons/folder_closed.png');
                log('Project '+site+' loaded','success');
            }else if(data.message=='Not logged'){
                    show_login_form();
                }else{
                log('ERROR: loading projet failed','error');
                log(data.message,'error');
            }
        },
        error: function(data){
            log('ERROR: Loading project '+site+' failed','error');
            log(data.message,'error');
        }
    });
    if(file!==undefined){
        open_folders(file);
    }
}

function file_hierarchy(obj){
    var html = '';
    for(var i=0;i<obj.length;i++){
        if(typeof obj[i].is_folder=='undefined'){
            html += '<li><span class="open_file" title="'+cut_title(obj[i].file)+'" data-name="'+obj[i].name+'" data-file="'+obj[i].file+'"><img src="public/img/icons/'+obj[i].icon+'.png"/> '+obj[i].name+'</li>';
        }else{
            html += '<li><span class="open_folder" title="'+cut_title(obj[i].file)+'" data-name="'+obj[i].name+'" data-file="'+obj[i].file+'"><img src="public/img/icons/folder_closed.png"/> '+obj[i].name+'</span></li>';
        }
    }
    return html;
}

function open_folders(file){
    var parent = $('#browser span[data-file="'+file+'"]');
    parent.show();
    parent = parent.parent().parent();
    do{
        parent.show();
        if(parent.prev().length>0){
            parent.prev().show();
            parent.prev().not('.site').find('img').attr('src','public/img/icons/folder_opened.png');
            parent = parent.prev().parent().parent();
        }else{
            break;
        }
    }while(true);
}

function log(text,clas){
    if(!clas) clas='';
    $('#log').append('<span class="'+clas+'">&gt; '+text+'</span><br/>');
    $('#log').scrollTop(99999999999);
}

function file_uploaded(data){
    $('#upload_form input[type="file"]').val('');
    data = $.parseJSON(data);
    if(data.status=='success'){
        log('File '+data.file+' uploaded','success');
        var folder = $('#browser span[data-file="'+data.folder+'"]');
        folder.parent().find('ul').remove();
        open_folder(data.folder);
    }else{
        log('ERROR: File upload failed','error');
        log(data.message,'error');
    }
}

function get_previous_files(){
    if(typeof localStorage!="undefined"){
        var files = localStorage.getItem('opened_files');
        if(files===null) return [];
        return $.parseJSON(files);
    }else{
        return false;
    }
}

function load_previous_files(){
    var files = get_previous_files();
    if(files!==false){
        for(var i=0;i<files.length;i++){
            if(files[i].site.indexOf('mangolight_editor_browser')!=-1){
                open_browser(files[i].file,files[i].site.indexOf('_reload')!=-1);
            }else{
                open_file(files[i].site,files[i].file);
            }
        }
    }
}

function add_previous_file(site,file){
    var files = get_previous_files();
    if(files!==false){
        var found=false;
        for(var i=0;i<files.length;i++){
            if(files[i].site==site && files[i].file==file) found=true;
        }
        if(found===false){
            files.push({'site':site,'file':file});
            localStorage.setItem('opened_files',JSON.stringify(files));
        }
    }
}

function remove_previous_file(site,file){
    var files = get_previous_files();
    if(files!==false){
        var new_files = [];
        for(var i=0;i<files.length;i++){
            if(!(files[i].site==site && files[i].file==file)){
                new_files.push(files[i]);
            }
        }
        localStorage.setItem('opened_files',JSON.stringify(new_files));
    }
}

function reset_previous_files(){
    if(get_previous_files()!==false){
        var files = [];
        var tabs = $('#tabs li')
        for(var i=0;i<tabs.length;i++){
            files.push({'site':$(tabs[i]).attr('data-site'),'file':$(tabs[i]).attr('data-file')});
        }
        localStorage.setItem('opened_files',JSON.stringify(files));
    }
}

function open_folder(folder){
    var site = $('#project_selector select').val();
    $.ajax({
        url: 'functions/ftp/list.php',
        data: {'site':site,'folder':folder},
        type: 'post',
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.status=='success'){
                var folder = $('#browser span[data-file="'+data.folder+'"]');
                folder.find('img').attr('src','public/img/icons/folder_opened.png');
                var ul = $('<ul>').hide();
                ul.append(file_hierarchy(data.files));
                folder.parent().append(ul);
                ul.slideDown('fast');
            }else if(data.message=='Not logged'){
                show_login_form();
            }else{
                log('ERROR opening folder '+clicked_element.attr('data-file'),'error');
                log(data.message,'error');
            }
        },
        error: function(data){
            log('ERROR opening folder '+clicked_element.attr('data-file'),'error');
            log(data.message,'error');
        }
    });
}

function check_logged(){
    $.ajax({
        url: base_url + 'functions/check_logged.php',
        data: {'check':'true'},
        dataType: 'json',
        success: function(data){
            if(data.status=='success'){
                if($('#browser ul').html()=='') update_file_browser();
                if($('#tabs ul').html()=='') load_previous_files();
                $('#login_layer').hide();
            }else{
                show_login_form();
            }
        },
        error: function(data){
            show_login_form();
        }
    });
}

function show_login_form(){
    if($('#login_layer').css('display')=='none'){
        log('Not logged','error');
        $('#login_layer').fadeIn('fast');
    }
}

function show_settings_form(){
    $.ajax({
        url: base_url + 'functions/get_config.php',
        dataType: 'json',
        success: function(data){
            if(data.status=='success'){
                $('#settings_form [name="settings_login"]').val(data.config.user.login);
                $('#settings_form [name="settings_password"]').val(data.config.user.password);
                
                $('#settings_form select[name="code_theme"]').html('');
                for(var i=0;i<data.config.available_code_themes.length;i++){
                    var option = $('<option>').text(data.config.available_code_themes[i]);
                    if(data.config.available_code_themes[i]==data.config.code_theme) option.attr('selected','selected');
                    $('#settings_form select[name="code_theme"]').append(option);
                }
                $('#settings_form select[name="interface_theme"]').html('');
                for(var i=0;i<data.config.available_interface_themes.length;i++){
                    var option = $('<option>').text(data.config.available_interface_themes[i]);
                    if(data.config.available_interface_themes[i]==data.config.interface_theme) option.attr('selected','selected');
                    $('#settings_form select[name="interface_theme"]').append(option);
                }
                $('#settings_form tbody').html('');
                if(!data.config.sites.length){
                    $('#settings_form table tbody').html(ftp_tr('','','21','','',''));
                }else{
                    for(var i=0;i<data.config.sites.length;i++){
                        var tr = ftp_tr(data.config.sites[i].name,data.config.sites[i].host,data.config.sites[i].port,data.config.sites[i].user,data.config.sites[i].password,data.config.sites[i].path);
                        $('#settings_form tbody').append(tr);
                    }
                }
                $('#settings_layer').fadeIn('fast');
            }else{
                log('ERROR: loading configuration file failed','error');
                log(data.message,'error');
            }
        },
        error: function(data){
            log('ERROR: loading configuration file failed','error');
            log(data.message,'error');
        }
    });
}

function save_settings(){
    if($('#settings_login').val()=='' || $('#settings_password').val()==''){
    alert('Please set a login and password.');
    return;
    }
    $.ajax({
       url: base_url + 'functions/save_config.php',
       data: $('#settings_form').serialize(),
       type: 'post',
       dataType: 'json',
       success: function(data){
           if(data.status=='success'){
           $('#login_layer').removeClass('config_not_set');
               change_theme(data.config.interface_theme,data.config.code_theme);
               $('#project_selector select').html('');
               for(var i=0;i<data.config.sites.length;i++){
                   var option = $('<option>').text(data.config.sites[i].name);
                   $('#project_selector select').append(option);
               }
                update_file_browser();
               $('#settings_layer').hide();
           }else if(data.message=='Not logged'){
                show_login_form();
            }else{
                log('ERROR: Saving configuration file failed','error');
                log(data.message,'error');
            }
       },
       error: function(data){
            alert('Saving configuration failed: '+data.message);
       }
    });
}

function change_theme(interface_theme,code_theme){
    $('#interface_theme').attr('href',base_url + '/public/styles/themes/' + interface_theme + '.css');
    theme = code_theme;
    for(var i=0;i<editors.length;i++){
        editors[i].editor.setTheme("ace/theme/"+code_theme);
    }
}

function load_previous_config(){
    $.ajax({
        url: base_url + 'functions/get_config.php',
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.status=='success'){
                if(data.config.not_set){
                    $('#settings_form .cancel').hide();
                    show_settings_form();
                    $('#login_layer').addClass('config_not_set');
                }
                for(var i=0;i<data.config.sites.length;i++){
                    $('#project_selector select').append($('<option>').text(data.config.sites[i].name));
                }
                change_theme(data.config.interface_theme,data.config.code_theme);
            }
        }
    });
}

function ftp_tr(name,host,port,user,password,directory){
    var tr = $('<tr>');
    tr.append('<td><input type="text" name="ftp_name[]" placeholder="Name" value="'+name+'"/></td>');
    tr.append('<td><input type="text" name="ftp_host[]" placeholder="Host" value="'+host+'"/></td>');
    tr.append('<td><input type="text" name="ftp_port[]" placeholder="Port" value="'+port+'"/></td>');
    tr.append('<td><input type="text" name="ftp_user[]" placeholder="User" value="'+user+'"/></td>');
    tr.append('<td><input type="text" name="ftp_password[]" placeholder="Password" value="'+password+'"/></td>');
    tr.append('<td><input type="text" name="ftp_path[]" placeholder="Directory" value="'+directory+'"/></td>');
    tr.append('<td class="actions"><i class="test_ftp fa fa-check-circle-o" title="Test FTP"></i> <i class="remove_ftp fa fa-trash-o" title="Remove FTP"></i></td>');
    return tr;
}

function get_color(ext){
    while(ext.length<6) ext += ext;
    var sum = 1;
    for(var i=0;i<6;i++){
        sum += Math.pow(10,i)*ext.charCodeAt(i);
    }
    var hex = '#';
    for(var i=0;i<6;i++){
        hex += (parseInt(sum.toString().substring(sum.toString().length-i-1,sum.toString().length-i))+3).toString(16);
    }
    return hex;
}
