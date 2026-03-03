/**
 * DSC Proxy Server
 * 代理浏览器请求 → WeBASE-Front，解决跨域问题
 * 接口参考：https://webasedoc.readthedocs.io/zh-cn/latest/docs/WeBASE-Front/interface.html
 */
import express from 'express';

const app    = express();
const PORT   = 3001;
const WEBASE = 'http://8.137.93.11:5002/WeBASE-Front';

app.use(express.json({ limit: '4mb' }));

// ── 通用代理函数 ──────────────────────────────
async function proxy(res, url, opts = {}) {
  try {
    const r    = await fetch(url, opts);
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { code: -1, message: text }; }
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    res.status(502).json({ code: -1, message: `连接 WeBASE-Front 失败: ${e.message}` });
  }
}

// ── 获取本地私钥列表 ──────────────────────────
// 文档：GET /privateKey/localKeyStores
app.get('/api/users', (_req, res) => {
  proxy(res, `${WEBASE}/privateKey/localKeyStores`);
});

// ── 编译合约 ──────────────────────────────────
// 文档：POST /contract/contractCompile
// Body: { contractName, solidityBase64 }
app.post('/api/compile', (req, res) => {
  proxy(res, `${WEBASE}/contract/contractCompile`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(req.body),
  });
});

// ── 部署合约 ──────────────────────────────────
// 文档：POST /contract/deploy
// Body: { groupId, user, contractName, abiInfo, bytecodeBin, funcParam }
app.post('/api/deploy', (req, res) => {
  proxy(res, `${WEBASE}/contract/deploy`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(req.body),
  });
});

app.listen(PORT, () =>
  console.log(`[DSC Proxy]  :${PORT}  →  ${WEBASE}`)
);
