!git push -u origin $(git branch --show-current)
###
 # @Author: zhenghuahou 2430370966@qq.com
 # @Date: 2025-05-22 14:59:21
 # @LastEditors: zhenghuahou 2430370966@qq.com
 # @LastEditTime: 2025-05-24 10:06:44
 # @FilePath: /fe-notebook/docs/!git push -u origin $(git branch --show-.sh
 # @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
### 
git config --global alias.pushu '!git push -u origin $(git rev-parse --abbrev-ref HEAD)'

git push origin --delete test-temp



git config --global --get-regexp alias

git config --global alias.alias "config --global --get-regexp alias"


git config --global alias.newb '!f() { git fetch origin && git checkout -b "$1" origin/develop; }; f'

git config --global alias.newdev \!'f() { git fetch origin && git checkout -b $1 --no-track origin/dev; }; f'


git config --global alias.trim \!'git fetch --prune && git branch --merged | grep -E -v "^((\* )|\s*(develop|master)$)" | xargs git branch -d'
