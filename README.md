# 交互 Cli 爬虫

一个奇怪的需求衍生出的奇怪项目

### 目前已有的功能

1. bbs.wcccc.cc

### bbs.wcccc.cc

请注意，目前此功能配置为**需要账户为 VIP**才能正常使用，并未测试非 VIP 用户表现如何

第一次使用请配置账户 cookie，输入`>wc.cookie + [cookies]`

cookie 只需要包含两个内容 `*_*_saltkey`和`*_*_auth`及其形似内容

紧接着使用`wc.url + [url]`开始获取，url 为列表的任意页面，会自动从该页一直爬到最后一页，例如[同人](https://bbs.wcccc.cc/forum.php?mod=forumdisplay&fid=56&filter=typeid&typeid=70)

**请输入q进行退出，请勿直接关闭终端**，直接关闭会导致任务队列未进行保存