const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
    const elements = new Map();
    function element(id) {
        if (!elements.has(id)) {
            const classes = new Set();
            elements.set(id, { id, value: '', textContent: '', innerHTML: '', disabled: false,
                style: {}, dataset: {}, hidden: false,
                classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
                addEventListener() {}, setAttribute() {}, appendChild() {}, querySelector: selector => element(id + selector),
                querySelectorAll: () => [], checkValidity: () => true, reportValidity() {}, reset() {} });
        }
        return elements.get(id);
    }
    const storage = new Map();
    const context = { console: { error() {}, log() {} }, alert() {}, confirm: () => true,
        APP_CONFIG: { admin: { key: 'test' } },
        sessionStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) },
        document: { getElementById: element, querySelectorAll: () => [], addEventListener() {}, createElement: () => element(Math.random()) },
        i18n: { t: x => x, currentLang: 'en' }, db: { products: {} },
        crypto: require('node:crypto').webcrypto, setTimeout, clearTimeout,
        addEventListener() {}, URL, AbortController };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8'), context);
    context.renderProducts = () => {};
    context.renderAdminProducts = () => {};
    const run = s => vm.runInContext(s, context);
    element('productName').value = 'Bearing';
    element('productPrice').value = '5';
    element('productCategory').value = 'bearings';
    element('productMaterial').value = 'steel';
    element('productSize').value = 'M8';
    element('productFormModal').classList.add('active');
    run("currentImageUrl = 'https://example.com/image.jpg'");
    return { c: context, element, run };
}

const record = { id: 'one', name: 'Bearing', price: '5', category: 'bearings', material: 'steel', size: 'M8', image: 'photo', description_zh: '原来的中文描述' };

test('loading products preserves Chinese descriptions when opening an edit', async () => {
    const a = app(); a.c.db.products.getAll = async () => [record];
    await a.c.loadProductsFromDB();
    a.c.openProductForm('one');
    assert.equal(a.element('productDescriptionZh').value, record.description_zh);
});

test('an already-open admin list refreshes after the initial query finishes', async () => {
    const a = app(); let renders = 0;
    a.element('adminDashboard').classList.add('active');
    a.c.renderAdminProducts = () => renders++;
    a.c.db.products.getAll = async () => [record];
    await a.c.loadProductsFromDB();
    assert.ok(renders > 0);
});

test('a confirmed saved product stays visible when the subsequent list query fails', async () => {
    const a = app();
    a.c.db.products.create = async data => ({ ...data, id: 'saved' });
    a.c.db.products.getAll = async () => { throw new Error('offline'); };
    await a.c.saveProduct();
    assert.equal(a.run('products.some(p => p.id === "saved")'), true);
});

test('double clicks during a pending write cause only one write', async () => {
    const a = app(); let release; let writes = 0;
    const waiting = new Promise(resolve => release = resolve);
    a.c.db.products.create = async data => { writes++; await waiting; return { ...data, id: 'saved' }; };
    a.c.db.products.getAll = async () => [record];
    const first = a.c.saveProduct(); const second = a.c.saveProduct();
    release(); await Promise.all([first, second]);
    assert.equal(writes, 1);
});

test('a failed database write preserves the uploaded image and open form for retry', async () => {
    const a = app();
    a.run("selectedImageFile = { name: 'bearing.jpg' }; currentImageUrl = null");
    a.c.db.storage = { uploadImage: async () => 'https://example.com/uploaded.jpg' };
    a.c.db.products.create = async () => { throw new Error('offline'); };
    await a.c.saveProduct();
    assert.equal(a.run('currentImageUrl'), 'https://example.com/uploaded.jpg');
    assert.equal(a.element('productName').value, 'Bearing');
    assert.equal(a.element('productFormModal').classList.contains('active'), true);
    assert.equal(a.element('saveProduct').disabled, false);
});

test('read failure is reported to callers and preserves previously loaded products', async () => {
    const a = app(); a.run('products = [{ id: "existing" }]; isDataLoaded = true');
    a.c.db.products.getAll = async () => { throw new Error('offline'); };
    assert.equal(await a.c.loadProductsFromDB(), false);
    assert.equal(a.run('products[0].id'), 'existing');
});

test('an old read cannot remove a product confirmed by a later save', async () => {
    const a = app(); let finishRead;
    a.c.db.products.getAll = () => new Promise(resolve => finishRead = resolve);
    const reading = a.c.loadProductsFromDB();
    a.c.db.products.create = async data => ({ ...data, id: 'new-product' });
    await a.c.saveProduct();
    finishRead([]); await reading;
    assert.equal(a.run('products[0].id'), 'new-product');
});

test('retry retains the new product id and does not upload the image twice', async () => {
    const a = app(); let uploads = 0; const ids = [];
    a.run("selectedImageFile = { name: 'bearing.jpg' }; currentImageUrl = null");
    a.c.db.storage = { uploadImage: async () => { uploads++; return 'https://example.com/uploaded.jpg'; } };
    a.c.db.products.create = async data => {
        ids.push(data.id);
        if (ids.length === 1) throw new Error('response lost');
        return data;
    };
    await a.c.saveProduct(); await a.c.saveProduct();
    assert.equal(ids.length, 2); assert.equal(ids[0], ids[1]); assert.equal(uploads, 1);
    assert.equal(a.element('productFormModal').classList.contains('active'), false);
});

test('reopening an unsaved form restores text and the uploaded image', () => {
    const a = app();
    a.element('productDescriptionZh').value = '未保存的内容';
    a.c.persistProductDraft(); a.c.closeProductForm();
    a.element('productName').value = ''; a.element('productDescriptionZh').value = '';
    a.c.openProductForm();
    assert.equal(a.element('productName').value, 'Bearing');
    assert.equal(a.element('productDescriptionZh').value, '未保存的内容');
    assert.equal(a.run('currentImageUrl'), 'https://example.com/image.jpg');
});

test('an unuploaded replacement image must be reselected after draft restoration', () => {
    const a = app(); a.run("selectedImageFile = { name: 'replacement.jpg' }");
    a.c.persistProductDraft(); a.c.openProductForm();
    assert.equal(a.run('currentImageUrl'), null);
    assert.equal(a.element('imagePreview').style.display, 'none');
});

test('initial failure shows retry; a successful retry clears the error', async () => {
    const a = app();
    a.c.db.products.getAll = async () => { throw new Error('offline'); };
    await a.c.loadProductsFromDB();
    assert.equal(a.element('catalogStatus').hidden, false);
    assert.equal(a.element('catalogStatusbutton').hidden, false);
    a.c.db.products.getAll = async () => [record]; await a.c.loadProductsFromDB();
    assert.equal(a.element('catalogStatus').hidden, true);
});

test('invalid prices do not write or dismiss the form', async () => {
    const a = app(); let writes = 0;
    a.c.db.products.create = async () => writes++;
    for (const value of ['-1', 'NaN', 'Infinity']) {
        a.element('productPrice').value = value; await a.c.saveProduct();
    }
    assert.equal(writes, 0);
    assert.equal(a.element('productFormModal').classList.contains('active'), true);
});

test('the editor cannot close while a database write is pending', async () => {
    const a = app(); let finish;
    a.c.db.products.create = data => new Promise(resolve => { finish = () => resolve(data); });
    const saving = a.c.saveProduct(); a.c.closeProductForm();
    assert.equal(a.element('productFormModal').classList.contains('active'), true);
    finish(); await saving;
    assert.equal(a.element('productFormModal').classList.contains('active'), false);
});

test('material filters populate even when materials arrive after categories', async () => {
    const a = app();
    a.c.db.categories = {getAll: async () => []};
    a.c.db.materials = {getAll: async () => [{name:'steel',display_name:'Steel'}]};
    await a.c.loadCategoriesFromDB(); await a.c.loadMaterialsFromDB();
    assert.match(a.element('materialFilter').innerHTML, /value="steel"/);
});
