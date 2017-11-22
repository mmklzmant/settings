@echo off
rem ===%i%
rem %1%第一个参数为项目录（项目名）
set objdir=%1%
set path=%2%

mkdir %objdir%

xcopy %path%\public %objdir%\public/s
copy %path%\package.json %objdir%\package.json
copy %path%\Gruntfile.js %objdir%\Gruntfile.js

@echo on