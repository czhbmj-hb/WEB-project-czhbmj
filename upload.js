// 使用立即执行函数避免污染全局作用域
let jsonData = null;

const fileInput = document.getElementById('xlsxFileInput');
const processBtn = document.getElementById('xlsxProcessBtn');
const downloadImportTemplateBtn = document.getElementById('xlsxDownloadImportTemplateBtn');
const downloadCategoryBtn = document.getElementById('xlsxDownloadCategoryBtn');
const downloadMaterialBtn = document.getElementById('xlsxDownloadMaterialBtn');
const messageDiv = document.getElementById('xlsxMessage');

// 显示消息
function showMessage(text, type = 'info') {
    messageDiv.innerHTML = `<div class="xlsx-message ${type}">${text}</div>`;
}

// 文件选择事件
fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        showMessage(`✅ 已选择文件：${file.name}`, 'success');
        processBtn.disabled = false;
    }
});

// 处理文件
processBtn.addEventListener('click', function () {
    const file = fileInput.files[0];
    if (!file) {
        showMessage('❌ 请先选择文件！', 'error');
        return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
        try {
            // 读取文件
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});

            // 获取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // 转换为JSON
            jsonData = XLSX.utils.sheet_to_json(worksheet, {
                raw: false,
                defval: ''
            });

            // 检查数据
            let validityData = [];
            let errorCount = 0;
            const categoriesName = categoriesData.map(item => item.name)
            const materialsName = materialsData.map(item => item.name)
            for (const item of jsonData) {
                if (!categoriesName.includes(item['分类']) || !materialsName.includes(item['材料名称'])) {
                    errorCount++;
                    validityData.push(item)
                } else {
                    const productData = {
                        name: item['产品名称'],
                        category: item['分类'],
                        material: item['材料名称'],
                        price: item['价格'],
                        size: item['尺寸'],
                        image: '',
                        description: item['描述'],
                        description_zh: item['中文描述'],
                    };
                    await db.products.create(productData);
                }
            }
            exportFail(validityData);
            fileInput.value = '';
            showMessage(`✅ 处理成功！共 ${jsonData.length - errorCount} 条数据，❌ 处理失败：${errorCount} 条数据无效，请仔细检查分类和材料是否存在！`, 'success');
        } catch (error) {
            showMessage('❌ 处理失败：' + error.message, 'error');
            console.error(error);
        }
    };

    reader.onerror = function () {
        showMessage('❌ 文件读取失败！', 'error');
    };

    reader.readAsArrayBuffer(file);
});

function exportFail(validityData) {
    try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(validityData);

        // 设置列宽
        worksheet['!cols'] = [
            {wch: 20},  // 产品名称
            {wch: 15},  // 分类
            {wch: 15},  // 材料名称
            {wch: 15},  // 价格
            {wch: 18},  // 尺寸
            {wch: 20},  // 描述
            {wch: 20}   // 中文描述
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, '失败数据');
        XLSX.writeFile(workbook, '失败数据.xlsx');
    } catch (error) {
        showMessage('❌ 失败数据导出失败：' + error.message, 'error');
        console.error(error);
    }
}

// 下载导入模板（默认模板，包含所有列）
downloadImportTemplateBtn.addEventListener('click', function () {
    try {
        // 创建默认导入模板数据
        const importTemplateData = [
            {
                '产品名称': 'M8螺栓',
                '分类': 'bolts',
                '材料名称': 'steel',
                '价格': '0.1',
                '尺寸': 'M8x30',
                '描述': '',
                '中文描述': ''
            }
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(importTemplateData);

        // 设置列宽
        worksheet['!cols'] = [
            {wch: 20},  // 产品名称
            {wch: 15},  // 分类
            {wch: 15},  // 材料名称
            {wch: 15},  // 价格
            {wch: 18},  // 尺寸
            {wch: 20},  // 描述
            {wch: 20}   // 中文描述
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, '导入模板');
        XLSX.writeFile(workbook, '导入模板.xlsx');

        showMessage('✅ 导入模板下载成功！', 'success');

    } catch (error) {
        showMessage('❌ 下载失败：' + error.message, 'error');
        console.error(error);
    }
});

// 下载分类名称模板（直接下载，不需要上传文件）
downloadCategoryBtn.addEventListener('click', function () {
    try {
        // 创建分类名称模板数据
        const categoryTemplateData = categoriesData.map(category => {
            return {'分类名称': category.name}
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(categoryTemplateData);

        // 设置列宽
        worksheet['!cols'] = [
            {wch: 20},  // 分类名称
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, '分类名称');
        XLSX.writeFile(workbook, '分类名称模板.xlsx');

        showMessage('✅ 分类名称模板下载成功！', 'success');

    } catch (error) {
        showMessage('❌ 下载失败：' + error.message, 'error');
        console.error(error);
    }
});

// 下载材料名称模板（直接下载，不需要上传文件）
downloadMaterialBtn.addEventListener('click', function () {
    try {
        // 创建材料名称模板数据
        const materialTemplateData = materialsData.map(material => {
            return {'材料名称': material.name}
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(materialTemplateData);

        // 设置列宽
        worksheet['!cols'] = [
            {wch: 20},  // 材料名称
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, '材料名称');
        XLSX.writeFile(workbook, '材料名称模板.xlsx');

        showMessage('✅ 材料名称模板下载成功！', 'success');

    } catch (error) {
        showMessage('❌ 下载失败：' + error.message, 'error');
        console.error(error);
    }
});

// 拖拽上传支持
const uploadArea = document.querySelector('.xlsx-upload-area');

uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.background = '#f0f4ff';
    this.style.borderColor = '#764ba2';
});

uploadArea.addEventListener('dragleave', function () {
    this.style.background = '#f8f9ff';
    this.style.borderColor = '#667eea';
});

uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.background = '#f8f9ff';
    this.style.borderColor = '#667eea';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event('change'));
    }
});