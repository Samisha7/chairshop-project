@echo off
setlocal enabledelayedexpansion

:: Read the file before products section
set "before="
for /f "delims=" %%a in ('findstr /n "^" "chair shop.html"') do (
    set "line=%%a"
    set "line=!line:*:=!"
    if "!line!"=="        <section class="products-grid">" (
        goto :after_before
    )
    set "before=!before!!line!"!
)

:after_before
:: Add the new products section
set "newcontent=!before!"
for /f "delims=" %%a in ('type "products_only.html"') do (
    set "newcontent=!newcontent!%%a"!
)

:: Read the file after products section
set "found_end=0"
for /f "delims=" %%a in ('findstr /n "^" "chair shop.html"') do (
    set "line=%%a"
    set "line=!line:*:=!"
    if "!found_end!"=="1" (
        set "newcontent=!newcontent!!line!"!
    )
    if "!line!"=="        </section>" (
        set "found_end=1"
    )
)

:: Write the result
echo !newcontent! > "chair shop.html"
echo Done!
