const fs = require("fs");
let c = fs.readFileSync("server.js","utf8");

c = c.replace(
  /(const path = require("'+"'"+"'path"+"'"+')\'+"'"+';\\n?)/,
  "$1\\n\\n// 全局未捕获异常处理 - 防止服务器在后台无声崩溃\\nprocess.on(\\"unhandledRejection\\", (reason) => {\\n  console.error(\\"[Server] 未捕获的 Promise 拒绝:\\", reason?.message || reason);\\n});\\n"
);
console.log("1:", c.includes("process.on"));

fs.writeFileSync("_test_output.js", c, "utf8");
console.log("written");
