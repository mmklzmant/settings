@echo off
rem ===%i%
rem %1%��һ������Ϊ��Ŀ¼����Ŀ����
Set objdir=%1%
set path=%2%

mkdir  %objdir% 


copy %path%common-obj\public %path%%objdir%\public
copy %path%common-obj\package.json %path%%objdir%\package.json
copy %path%common-obj\Gruntfile.js %path%%objdir%\Gruntfile.js
cd %objdir%
npm install
cd ..
@echo on