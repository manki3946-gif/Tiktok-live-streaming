let clients = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    // Hubungkan klien ke SSE stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    clients.push(res);

    req.on("close", () => {
      clients = clients.filter(c => c !== res);
    });
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      clients.forEach(c => c.write(`data: ${JSON.stringify(data)}\n\n`));
      res.status(200).end();
    });
  }
}
