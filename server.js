const http = require("http");
const fs = require("fs");
const path = require("path");

const DEFAULT_PORT = Number(process.env.PORT) || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      const statusCode = error.code === "ENOENT" ? 404 : 500;
      res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(statusCode === 404 ? "File not found" : "Server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });
    res.end(content);
  });
});

let currentPort = DEFAULT_PORT;

const startServer = (port) => {
  currentPort = port;
  server.listen(port, () => {
    console.log(`Quiz Application running at http://localhost:${port}`);
  });
};

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    const nextPort = currentPort + 1;
    console.log(`Port ${currentPort} is in use. Retrying on port ${nextPort}...`);
    startServer(nextPort);
    return;
  }

  throw error;
});

startServer(DEFAULT_PORT);
