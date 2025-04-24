
const express = require('express');

const router = express.Router();

const { defineWord, bookmarkWord } = require('../controllers/WordEntry.controllers.js');


router.post("/define", defineWord );

router.post("/bookmark", bookmarkWord )


module.exports = router;