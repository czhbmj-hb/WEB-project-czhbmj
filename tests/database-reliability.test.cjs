const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function client(extra = {}) {
    const context = { window: { APP_CONFIG: { supabase: { url: 'https://example.com', anonKey: 'test' } } },
        supabase: { createClient: () => ({}) }, AbortController,
        setTimeout: fn => setTimeout(fn, 0), clearTimeout, ...extra };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../supabase-client.js'), 'utf8'), context);
    return context;
}
test('transient database reads retry and recover', async () => {
    const c = client(); let calls = 0;
    const data = await c.readRows(async () => ++calls < 3 ? { error: new Error('temporary'), status: 503 } : { data: [1] });
    assert.deepEqual(data, [1]); assert.equal(calls, 3);
});
test('network exceptions retry, but retries stop after three attempts', async () => {
    const c = client(); let calls = 0;
    await assert.rejects(c.readRows(async () => { calls++; throw new Error('offline'); }), /offline/);
    assert.equal(calls, 3);
});
test('permission failures are not repeatedly retried', async () => {
    const c = client(); let calls = 0;
    await assert.rejects(c.readRows(async () => { calls++; return { error: new Error('denied'), status: 403 }; }), /denied/);
    assert.equal(calls, 1);
});
test('a hanging request is aborted instead of waiting forever', async () => {
    const c = client({ fetch: (_url, options) => new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    }) });
    await assert.rejects(c.databaseFetch('https://example.com'), /aborted/);
});
test('a retry after a duplicate UUID updates the same product', async () => {
    const writes = [];
    const chain = { insert: data => { writes.push(['insert', data]); return chain; },
        update: data => { writes.push(['update', data]); return chain; },
        eq: (_key, id) => { writes.push(['id', id]); return chain; }, select: () => chain,
        single: async () => writes.length === 1 ? { error: { code: '23505' } } : { data: { id: 'draft-id' } } };
    const c = client({ supabase: { createClient: () => ({ from: () => chain }) } });
    const saved = await vm.runInContext("db.products.create({id: 'draft-id', name: 'Bearing'})", c);
    assert.equal(saved.id, 'draft-id'); assert.equal(writes[2][1], 'draft-id');
});
