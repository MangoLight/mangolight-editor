<a href="http://www.mangolight.com/labs/mangolight_editor/">
  <img src="http://www.mangolight.com/labs/mangolight_editor/public/img/logo.png" width="100px">
</a>

MangoLight Editor
=================
MangoLight Editor is a lightweight open-source code editor that works in the cloud, created by [Nicolas Thomas](http://www.nicolasthomas.fr) from [MangoLight](http://www.mangolight.com) Web agency.

## Features
- Remote edit your files in your browser
- Run on your own server
- Unlimited FTP connections, simultaneously
- Small, simple and very fast
- Basic requirements (PHP & jQuery)
- Open-source
- Files browser, tabs bar, functions browser
- Multiple windows
- Password protected
- Light or dark interface / 36 code themes
- Based on the incredible Ace Editor
- Syntax coloration for +100 languages
- Autocomplete
- Code folding
- Multiple cursors
- Search and replace using regex
- Create/Edit/Delete remote files and folders
- Rename and move remote files
- Download an upload files
- View remote images
- View your changes using the integrated web-browser

## Installation notes
Note: MangoLight Editor is in early stages of development. Please configure correctly your server in order to restrict the access to this tool. Suggestions, improvements, and fixes are welcome. Read the Licence before using MangoLight Editor. I am not responsible in any damage this tool could do on your files, server, computer or life! Enjoy :)

1. Download MangoLight Editor and upload it to your server
2. Set writing permission to /tmp folder and config.php file
3. Open MangoLight Editor in your browser
4. Configure your login and password; and FTP connections
5. Start using it!

## Why another code editor?
The reasons why I created this tool:
- I love cloud editors for their simplicity, I just open my browser and can start coding.
- I don't want to be afraid of loosing anything if my computer crashes (a cron job back up daily my server's files).
- I don't like duplicate files, I'm always lost between local and remote versions.
- I'm always in a place where there is an Internet connection, so a cloud editor is fine for me.
- I want to have a code editor that I can make evolve / I like to create things.
- I don't need IDE powerful functionalities (compiling, refactoring, collaborative editing, ...).
- I got used to avoid developping locally, I prefer to code from my server and be sure everything is backed up.

I shared this code editor because I think it can be useful for someone else than me. Try it and see if it fits your needs!

## Todo
- Better security, attach tokens to any actions to prevent CSRF attack
- Manage mutliple users / Hosted version
- Plugins
- Upload several files at the same time
- Download entire directory as zip file
- View files size
- View/Edit files permissions
- Your ideas...

## Keyboard shortcuts list
- _Ctrl + S_: Save/upload file
- _Ctrl + C_: Copy
- _Ctrl + X_: Cut
- _Ctrl + V_: Paste
- _Ctrl + Z_: Undo
- _Ctrl + Y_: Redo
- _Ctrl + F_: Search
- _Ctrl + H_: Search & Replace
- _Ctrl + L_: Go to line
- _Ctrl + D_: Delete current line
- _Ctrl + Shift + D_: Duplicate current line (or current selection)
- _Ctrl + P_: Jump to matching bracket
- _Ctrl + Shift + P_: Select all until matching bracket
- _Ctrl + Alt + Shift + Left_: Jump to previous similar word
- _Ctrl + Alt + Shift + Right_: Jump to next similar word
- _Alt + A_: Go to next tab
- _Alt + Shift + A_: Go to previous tab
- _Alt + Q_: close current tab
- _Alt + M_: toggle maximize file
- _Ctrl + Q_: Focus functions browser search bar
- _Ctrl + Shift + F_: Focus files browser search bar
- _Ctrl + Alt + E_: Record macro
- _Ctrl + Shift + E_: Replay macro
- _Alt + F_: Toggle hide files browser
- _Ctrl + Click_: Place multiple cursors
- _Ctrl + Shift + Up/Down_: Increase/Decrease number
- _Ctrl + ,_: Show Ace editor advanced settings

## Licenses
MangoLight Editor is released under the Apache License, Version 2.0: see http://www.apache.org/licenses/LICENSE-2.0
MangoLight Editor uses Ace editor, released under the BSD License: see https://github.com/ajaxorg/ace/blob/master/LICENSE
MangoLight Editor also uses Font Awesome, released under SIL OFL 1.1 and MIT License: see http://fortawesome.github.io/Font-Awesome/license/