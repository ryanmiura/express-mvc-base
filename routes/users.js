const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Área de usuários');
});

module.exports = router;