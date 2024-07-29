### 切换 git 源

```bash
git remote set-url origin [remote_address]
```

### git pull

远程跟踪分支是您的本地分支从中提取更改并将更改推送到的分支。 如果您的分支没有远程跟踪分支，该命令将失败。

因此 git pull 命令将从远程存储库中获取更改并将它们合并到签出分支的尖端。 要使命令生效，您的本地分支必须有一个远程跟踪分支。

### git pull origin master

git pull origin master 命令将从远程 master 分支获取更改并将它们合并到您当前签出的分支

```bash
//更多请阅读：https:
//www.yiibai.com/git/git_pull.html
$ git pull <远程主机名> <远程分支名>:<本地分支名>

```

比如，要取回 origin 主机的 next 分支，与本地的 master 分支合并，需要写成下面这样 -

```bash
$ git pull origin next:master
```

如果远程分支(next)要与当前分支合并，则冒号后面的部分可以省略。上面命令可以简写为：

```bash
$ git pull origin next
```

上面命令表示，取回 origin/next 分支，再与当前分支合并。实质上，这等同于先做 git fetch，再执行 git merge。

```bash
$ git fetch origin
$ git merge origin/next
```

`回退上个版本`

```bash
git reset --hard HEAD^
```

`检出分支`

```bash
# 方法一 :
# To not track the remote 从远端bar分支检出本地分支foo,但是foo分支不跟踪远端bar分支
git checkout -b foo --no-track origin/bar

# 方法二: 从远端origin/dev 检出本地分支local，并自动跟踪远端origin/dev分支
#To track the remote:
git checkout -b local  origin/dev

# 方法三: 从远端`feature/leap`分支检出本地`local`分支，但是不自动跟踪远端`feature/leap`分支
# Ps：使用该方式会在本地新建分支x，但是不会自动切换到该本地分支x，需要手动checkout；采用此种方法建立的本地分支不会和远程分支建立映射关系
git fetch origin feature/leap:local

```

`查看本地分支与远程分支关联关系`

```bash
git branch -vv
```

##### 关联远端分支

- . 没有对应的远端分支的时候
  `将本地分支与远端add_order分支关联(会创建远端分支add_order)`

```bash
# 将本地分支与远程分支关联 ，远程也会新建一个分支 feature/add_order
# 如果当前本地分支已经有关联的远端分支，先执行`git branch --unset-upstream`撤销和以前分支的关联状态
git push --set-upstream origin feature/add_order
```

- 已经存在了关联的远端分支，更改本地分支对应的远端分支

```bash
# 把本地分支关联的远端分支更改为`feature/add_order2`远端分支
git branch -u origin/feature/add_order2
```

##### 撤销本地分支与远程分支的映射关系

```bash
# 撤销本地分支与远程分支的映射关系
git branch --unset-upstream
```

##### 切换到上一个操作过的分支

```bash
# 切换到上一个操作过的分支
git checkout -
```

##### `git push`使用细节

`git push`使用细节
tips:如果新建的分支和远端的分支名字不一样，第一次 push 的时候，会有下面提示，按照提示
运行`git push origin HEAD:dev`即可。
`fatal: The upstream branch of your current branch does not match
the name of your current branch. To push to the upstream branch
on the remote, use`

```bash
git push origin HEAD:dev
```

To push to the branch of the same name on the remote, use

```bash
git push origin HEAD
```

`git stash`

```bash
git stash save 'message...'可以添加一些注释
```

##### 删除分支

```bash
# 删除本地分支
git branch -d localBranchName

# 删除远程分支
git push origin --delete remoteBranchName

# 删除远端`huazi/preApproval`分支,效果同上面
git push origin :huazi/preApproval
```

##### 创建远端分支

```bash
### 创建远端`feature/huazi/home`分支
git push origin dev:feature/huazi/home

```

##### 查看提交记录

```bash
# git查看其他远程分支提交记录
git log origin/feature/detail

# git 查看某一条提交记录的日志消息和文本diff
git show 807eb3e9f7296b6f7612e84fc991d47feee57140
```
