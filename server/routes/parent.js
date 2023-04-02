const express = require('express');
const router = express.Router();

router
      .route("/")
      .post(async (req, res) => {                 
      });
router
      .route('/:parentId')
      .get(async (req, res) => {
      })
      .put(async (req, res) => {
      })
      .delete(async (req, res) => {
      });

module.exports = router;