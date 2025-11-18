# Production Backup Report - 2025-11-18

## 备份信息 Backup Information

- **日期 Date**: 2025-11-18
- **Git Commit**: `2659c7f` - feat: Update company name to include Co.,Ltd and change Hardware to Bearing
- **Git Tag**: `production-backup-2025-11-18`
- **备份分支 Backup Branch**: `production-backup-2025-11-18`

## 项目结构 Project Structure

### 核心文件 Core Files
- **index.html** - 主页面文件 (30,872 bytes)
- **script.js** - 主JavaScript文件 (55,133 bytes)
- **styles.css** - 样式文件 (28,165 bytes)
- **i18n.js** - 国际化配置文件 (21,583 bytes)
- **supabase-client.js** - Supabase客户端配置 (6,718 bytes)
- **upload.js** - 文件上传功能 (8,033 bytes)

### 配置文件 Configuration Files
- **package.json** - 项目依赖配置
  - 主要依赖: `@supabase/supabase-js: ^2.39.3`
  - 开发依赖: `serve: ^14.2.1`
- **vercel.json** - Vercel部署配置
- **env.js** - 环境变量配置
- **config.js** - 应用配置
- **mail.js** - 邮件配置

### 数据库脚本 Database Scripts
- 多个SQL文件用于数据库结构和数据迁移
- 包含RLS（行级安全）配置
- 产品数据和分类管理脚本

### 文档 Documentation
- **README.md** - 项目说明
- **用户手册.md** - 用户操作指南
- **DEPLOYMENT_GUIDE.md** - 部署指南
- 各种修复和配置指南

## 恢复步骤 Rollback Steps

### 方法1: 使用Git Tag恢复
```bash
# 查看所有标签
git tag -l

# 切换到备份版本
git checkout production-backup-2025-11-18

# 如果需要基于此创建新分支
git checkout -b rollback-branch production-backup-2025-11-18
```

### 方法2: 使用备份分支恢复
```bash
# 切换到备份分支
git checkout production-backup-2025-11-18

# 如果需要将main重置到备份版本
git checkout main
git reset --hard production-backup-2025-11-18
```

### 方法3: 使用特定commit恢复
```bash
# 恢复到特定commit
git checkout 2659c7f

# 或者重置main分支
git checkout main
git reset --hard 2659c7f
```

## 重要提醒 Important Notes

1. **数据库变更**: 任何涉及数据库结构或后端API的修改都需要征求确认
2. **本地测试**: 所有修改必须在本地充分测试后才能部署
3. **部署控制**: 只有在明确指示后才进行git push和Vercel部署
4. **版本追踪**: 所有重要修改都应该创建新的git commit以便追踪

## 当前环境状态 Current Environment Status

- **Git Branch**: main
- **最新Commit**: 2659c7f (feat: Update company name to include Co.,Ltd and change Hardware to Bearing)
- **工作目录**: 有一个修改的子模块 WEB-project(2)
- **远程仓库**: origin/main 已同步

## 联系和支持 Contact & Support

如果在恢复过程中遇到任何问题，请参考以下文档：
- ROLLBACK_DATABASE.sql - 数据库回滚脚本
- 回退操作指南.md - 详细的回退操作说明

---

备份完成时间: 2025-11-18