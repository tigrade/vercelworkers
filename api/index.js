// api/index.js
export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: '请在参数中提供 target url' });
    }

    try {
        const decodeUrl = decodeURIComponent(url);
        
        // 1. 发起请求到目标服务器
        const response = await fetch(decodeUrl, {
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.9',
            },
            // 如果是 POST 请求，则转发 body
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        // 2. 处理跨域头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // 3. 获取响应内容并返回
        const data = await response.text();
        res.status(response.status).send(data);

    } catch (error) {
        res.status(500).json({ error: '代理请求失败', message: error.message });
    }
}