#!/usr/bin/env node
const readline = require("node:readline");
const tools = [{"name": "getPetById", "description": "GET /pet/{petId}", "input_schema": {"type": "object"}}, {"name": "getInventory", "description": "GET /store/inventory", "input_schema": {"type": "object"}}];
const info = { name: "OpenMCP Factory Demo MCP 3", version: "0.1.0" };
const out = (id, result) => process.stdout.write(
  JSON.stringify({jsonrpc:"2.0", id, result}) + "\n"
);
readline.createInterface({ input: process.stdin, terminal: false }).on("line", line => {
  let request; try { request = JSON.parse(line); } catch { return; }
  if (request.method === "initialize") out(request.id, {
    protocolVersion:"2024-11-05", capabilities:{tools:{}}, serverInfo:info
  });
  else if (request.method === "tools/list") out(request.id, { tools });
  else if (request.id !== undefined) out(request.id, {
    content:[{type:"text", text:"Generated MCP response"}]
  });
});
