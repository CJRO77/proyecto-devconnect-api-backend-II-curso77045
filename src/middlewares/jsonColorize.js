function jsonColorize(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    const wantsHtml = req.headers.accept && req.headers.accept.includes("text/html");

    if (wantsHtml) {
      const jsonString = JSON.stringify(data, null, 2);
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>API Response</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <style>
    body { margin: 0; background: #0d1117; }
    pre { padding: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <pre><code class="language-json">${escapeHtml(jsonString)}</code></pre>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
</body>
</html>`;
      return res.send(html);
    }

    return originalJson.call(this, data);
  };

  next();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default jsonColorize;