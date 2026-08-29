#!/usr/bin/env node

import readline from "node:readline";

const serverInfo = { name: "openmcp-demo-mcp", version: "0.1.0" };
const tools = [{
  name: "hello",
  description: "Return a greeting from the OpenMCP-VN demo server.",
  inputSchema: { type: "object", properties: { name: { type: "string" } } },
}];

function respond(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

const input = readline.createInterface({ input: process.stdin, terminal: false });
input.on("line", (line) => {
  let request;
  try { request = JSON.parse(line); } catch { return; }
  if (request.method === "initialize") {
    respond(request.id, { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo });
  } else if (request.method === "notifications/initialized") {
    return;
  } else if (request.method === "tools/list") {
    respond(request.id, { tools });
  } else if (request.method === "tools/call" && request.params?.name === "hello") {
    const name = request.params.arguments?.name || "OpenMCP-VN";
    respond(request.id, { content: [{ type: "text", text: `Hello, ${name}!` }] });
  } else if (request.id !== undefined) {
    respond(request.id, { error: { code: -32601, message: "Method not found" } });
  }
});
