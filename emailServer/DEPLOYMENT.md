# 📧 EmailServer 部署指南

## 快速部署到 Vercel

### 步骤 1: 安装 Vercel CLI (如果还没有)
```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel
```bash
vercel login
```

### 步骤 3: 部署项目
在 emailServer 目录中运行：
```bash
cd emailServer
vercel
```

### 步骤 4: 配置环境变量
在 Vercel 控制台中设置以下环境变量：

**生产环境变量 (Production):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=czhbmj@gmail.com
SMTP_PASS=vppynckowzzftoup
RECIPIENT_EMAIL=zhangyanbin_1@hotmail.com
CC_EMAIL=
```

**或使用 Vercel CLI 设置：**
```bash
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_SECURE production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add RECIPIENT_EMAIL production
vercel env add CC_EMAIL production
```

### 步骤 5: 重新部署
```bash
vercel --prod
```

## 测试邮件服务

部署完成后，获取你的 Vercel URL (例如: `https://your-project.vercel.app`)

使用 cURL 测试：
```bash
curl -X POST https://your-project.vercel.app/api/send-email.php \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "customer_email": "test@example.com",
    "customer_phone": "1234567890",
    "products": [
      {
        "name": "Test Product",
        "quantity": 1,
        "price": 10.00,
        "specs": "Test Specs"
      }
    ],
    "notes": "This is a test enquiry"
  }'
```

## 更新前端项目

部署完成后，将 Vercel URL 更新到主项目的 `mail.js` 文件中：

```javascript
// mail.js
async function sendMail(data) {
    return await fetch('https://your-project.vercel.app/api/send-email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
```

## 故障排除

### 问题: 邮件发送失败
- 检查 SMTP 凭据是否正确
- 确认 Gmail 账户已启用"不够安全的应用访问"
- 检查应用专用密码是否有效

### 问题: 502 Bad Gateway
- 检查 Vercel 函数日志
- 确认 composer 依赖已正确安装
- 验证 vercel.json 配置

### 问题: CORS 错误
- 确认 send-email.php 中的 CORS 头设置正确
- 检查前端请求的 URL 是否正确

## 安全注意事项

⚠️ **重要：**
- 永远不要将 `.env` 文件提交到 Git
- 使用环境变量而非硬编码凭据
- 定期更换 SMTP 密码
- 考虑使用 Gmail 应用专用密码而非主密码
