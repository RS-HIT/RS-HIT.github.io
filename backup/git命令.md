# 1. git命令记录

## 1.1 基础git命令

初始化 生成一个git仓库
```Bash
git init
```
由本地仓库关联远程仓库
```Bash
git remote add origin https://github.com/username/repo.git
```
添加所有文件到暂存区
```Bash
git add .
```
提交到本地仓库
```Bash
git commit -m "提交信息"
```
将本地仓库推送到远程仓库
```Bash
git push origin main
```
将远程仓库拉取到本地仓库
```Bash
git pull origin master
```
克隆仓库
```Bash
git clone https://github.com/username/repo.git
```
强制推送
```Bash
git push origin main --force
```
## 1.2 分支管理
查看分支
```Bash
git branch
```
切换分支
```Bash
git checkout main
```
创建并切换
```Bash
git checkout -b main
```
重命名分支
```Bash
git branch -m main
```
删除分支
```Bash
git branch -d main
```
合并分支
```Bash
git merge main
```

