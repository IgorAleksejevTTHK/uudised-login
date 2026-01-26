const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/connection");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// index
router.get("/", (req, res) => {
    db.query("SELECT * FROM news ORDER BY id DESC", (err, rows) => {
        res.render("index", { news: rows || [], message: req.query });
    });
});

// detail
router.get("/news/:id", (req, res) => {
    db.query("SELECT * FROM news WHERE id=?", [req.params.id], (err, rows) => {
        if (!rows.length) return res.status(404).render("404");
        res.render("detail", { item: rows[0] });
    });
});

// lisamine
router.get("/add", requireAdmin, (req, res) => {
    res.render("add", { errors: [], data: {} });
});

router.post("/add", requireAdmin,
    body("title").trim().notEmpty().withMessage("Pealkiri on kohustuslik"),
    body("content").trim().notEmpty().withMessage("Sisu on kohustuslik"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render("add", { errors: errors.array(), data: req.body });

        db.query("INSERT INTO news (title, content) VALUES (?, ?)",
            [req.body.title, req.body.content],
            err => {
                if (err) return res.redirect("/?error=1");
                res.redirect("/?success=1");
            });
    });

// muutmine
router.get("/edit/:id", requireAdmin, (req, res) => {
    db.query("SELECT * FROM news WHERE id=?", [req.params.id], (err, rows) => {
        if (!rows.length) return res.status(404).render("404");
        res.render("edit", { item: rows[0], errors: [] });
    });
});

router.post("/edit/:id", requireAdmin,
    body("title").trim().notEmpty(),
    body("content").trim().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render("edit", { item: { ...req.body, id: req.params.id }, errors: errors.array() });

        db.query("UPDATE news SET title=?, content=? WHERE id=?",
            [req.body.title, req.body.content, req.params.id],
            err => {
                if (err) return res.redirect("/?error=1");
                res.redirect("/news/" + req.params.id);
            });
    });

// kustutamine
router.post("/delete/:id", requireAdmin, (req, res) => {
    db.query("DELETE FROM news WHERE id=?", [req.params.id], err => {
        if (err) return res.redirect("/?error=1");
        res.redirect("/?deleted=1");
    });
});

module.exports = router;
