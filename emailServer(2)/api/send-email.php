<?php
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 只允许 POST 请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// 邮件 HTML 模板
function getEmailTemplate() {
    return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>产品询价单</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #003366; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px; }
        .customer-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .info-item { margin-bottom: 15px; }
        .info-item label { display: block; font-weight: bold; color: #555; margin-bottom: 5px; }
        .info-item span { color: #333; }
        .product-item { background: #f9f9f9; border-left: 4px solid #003366; padding: 20px; margin-bottom: 15px; border-radius: 0 8px 8px 0; }
        .product-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; }
        .product-name { font-size: 20px; font-weight: bold; color: #333; }
        .product-pricing { display: flex; gap: 15px; flex-wrap: wrap; }
        .price-badge { background: #003366; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .price-badge.quantity { background: #003366; }
        .price-badge.total { background: #003366; }
        .product-specs { color: #666; font-style: italic; }
        .total-section { background: #f0f4ff; padding: 20px; border-radius: 8px; text-align: right; border: 2px solid #003366; }
        .total-amount { font-size: 24px; font-weight: bold; color: #003366; }
        .notes { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        @media (max-width: 600px) {
            .product-header { flex-direction: column; align-items: flex-start; }
            .product-pricing { margin-top: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>产品询价单</h1>
            <p>Product Inquiry</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>客户信息</h2>
                <div class="customer-info">
                    <div class="info-item">
                        <label>姓名:</label>
                        <span>{{customer_name}}</span>
                    </div>
                    {{company_name_section}}
                    <div class="info-item">
                        <label>邮箱:</label>
                        <span>{{customer_email}}</span>
                    </div>
                    <div class="info-item">
                        <label>电话:</label>
                        <span>{{customer_phone}}</span>
                    </div>
                    {{customer_address_section}}
                    <div class="info-item">
                        <label>提交时间:</label>
                        <span>{{submit_time}}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>产品清单</h2>
                {{products_section}}
                
                <div class="total-section">
                    <div class="total-amount">总计: ${{total_amount}}</div>
                </div>
            </div>

            {{notes_section}}
        </div>

        <div class="footer">
            <p>此询价单由系统自动生成 | 如有疑问，请联系客服</p>
            <p>Generated on {{submit_time}} | Quote ID: {{quote_id}}</p>
        </div>
    </div>
</body>
</html>';
}

// 生成随机询价单号
function generateQuoteId() {
    $timestamp = date('Ymd');
    $random = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    return "INQ-{$timestamp}-{$random}";
}

// 格式化日期时间
function formatDateTime() {
    return date('Y-m-d H:i:s');
}

// 渲染邮件模板
function renderTemplate($template, $data) {
    // 处理公司名称
    $companySection = '';
    if (!empty($data['company_name'])) {
        $companySection = '
        <div class="info-item">
            <label>公司名称:</label>
            <span>' . htmlspecialchars($data['company_name']) . '</span>
        </div>';
    }

    // 处理地址
    $addressSection = '';
    if (!empty($data['customer_address'])) {
        $addressSection = '
        <div class="info-item">
            <label>地址:</label>
            <span>' . htmlspecialchars($data['customer_address']) . '</span>
        </div>';
    }

    // 处理产品列表
    $productsSection = '';
    foreach ($data['products'] as $product) {
        $subtotal = number_format($product['quantity'] * $product['price'], 2);
        $productsSection .= '
        <div class="product-item">
            <div class="product-header">
                <div class="product-name">' . htmlspecialchars($product['name']) . '</div>
                <div class="product-pricing">
                    <span class="price-badge quantity">数量: ' . $product['quantity'] . '</span>
                    <span class="price-badge">单价: $' . number_format($product['price'], 2) . '</span>
                    <span class="price-badge total">小计: $' . $subtotal . '</span>
                </div>
            </div>
            <div class="product-specs">规格: ' . htmlspecialchars($product['specs']) . '</div>
        </div>';
    }

    // 处理备注
    $notesSection = '';
    if (!empty($data['notes'])) {
        $notesSection = '
        <div class="section">
            <h2>备注信息</h2>
            <div class="notes">
                ' . nl2br(htmlspecialchars($data['notes'])) . '
            </div>
        </div>';
    }

    // 替换模板变量
    $replacements = [
        '{{customer_name}}' => htmlspecialchars($data['customer_name']),
        '{{customer_email}}' => htmlspecialchars($data['customer_email']),
        '{{customer_phone}}' => htmlspecialchars($data['customer_phone']),
        '{{company_name_section}}' => $companySection,
        '{{customer_address_section}}' => $addressSection,
        '{{products_section}}' => $productsSection,
        '{{notes_section}}' => $notesSection,
        '{{total_amount}}' => number_format($data['total_amount'], 2),
        '{{submit_time}}' => $data['submit_time'],
        '{{quote_id}}' => $data['quote_id']
    ];

    return str_replace(array_keys($replacements), array_values($replacements), $template);
}

try {
    // 获取请求数据
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }

    // 验证必填字段
    $requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'products'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    if (!is_array($data['products']) || empty($data['products'])) {
        throw new Exception('Products must be a non-empty array');
    }

    // 计算总金额
    $totalAmount = 0;
    foreach ($data['products'] as $product) {
        if (!isset($product['quantity']) || !isset($product['price'])) {
            throw new Exception('Each product must have quantity and price');
        }
        $totalAmount += $product['quantity'] * $product['price'];
    }

    // 准备模板数据
    $templateData = [
        'customer_name' => $data['customer_name'],
        'customer_email' => $data['customer_email'],
        'customer_phone' => $data['customer_phone'],
        'company_name' => $data['company_name'] ?? null,
        'customer_address' => $data['customer_address'] ?? null,
        'products' => $data['products'],
        'notes' => $data['notes'] ?? null,
        'total_amount' => $totalAmount,
        'submit_time' => formatDateTime(),
        'quote_id' => generateQuoteId()
    ];

    // 生成 HTML 内容
    $htmlContent = renderTemplate(getEmailTemplate(), $templateData);

    // 生成纯文本内容
    $textContent = "客户姓名: {$templateData['customer_name']}\n";
    $textContent .= "客户邮箱: {$templateData['customer_email']}\n";
    $textContent .= "客户电话: {$templateData['customer_phone']}\n";
    if (!empty($templateData['company_name'])) {
        $textContent .= "公司名称: {$templateData['company_name']}\n";
    }
    if (!empty($templateData['customer_address'])) {
        $textContent .= "地址: {$templateData['customer_address']}\n";
    }
    $textContent .= "\n产品清单:\n";
    foreach ($templateData['products'] as $product) {
        $subtotal = number_format($product['quantity'] * $product['price'], 2);
        $textContent .= "{$product['name']} - 数量: {$product['quantity']}, 单价: $" . number_format($product['price'], 2) . ", 小计: $" . $subtotal . ", 规格: {$product['specs']}\n";
    }
    $textContent .= "\n总计金额: $" . number_format($templateData['total_amount'], 2) . "\n";
    if (!empty($templateData['notes'])) {
        $textContent .= "备注: {$templateData['notes']}\n";
    }
    $textContent .= "\n提交时间: {$templateData['submit_time']}\n";
    $textContent .= "询价单号: {$templateData['quote_id']}\n";

    // 创建 PHPMailer 实例
    $mail = new PHPMailer(true);

    // 服务器配置
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'];
    $mail->Password = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = ($_ENV['SMTP_SECURE'] === 'true') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet = 'UTF-8';

    // 收件人
    $mail->setFrom($_ENV['SMTP_USER'], '询价系统');
    $mail->addAddress($_ENV['RECIPIENT_EMAIL'] ?? $templateData['customer_email']);

    // 抄送
    if (!empty($_ENV['CC_EMAIL'])) {
        $mail->addCC($_ENV['CC_EMAIL']);
    }

    // 邮件内容
    $mail->isHTML(true);
    $mail->Subject = "新的产品询价 - {$templateData['customer_name']} - {$templateData['quote_id']}";
    $mail->Body = $htmlContent;
    $mail->AltBody = $textContent;

    // 发送邮件
    $mail->send();

    // 返回成功响应
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '邮件发送成功',
        'quote_id' => $templateData['quote_id'],
        'total_amount' => number_format($templateData['total_amount'], 2)
    ]);

} catch (Exception $e) {
    error_log('邮件发送错误: ' . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '发送邮件失败',
        'details' => $e->getMessage()
    ]);
}
?>
