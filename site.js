const express = require("express");
const app = express();

app.use(express.static(__dirname));

app.listen(8080, () => {
  console.log("🌐 Site rodando em http://127.0.0.1:8080");
});