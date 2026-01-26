const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username=?", [username], async (err, rows) => {
        if (err || !rows.length) return res.render("login", { error: "Vale kasutaja" });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.render("login", { error: "Vale parool" });

        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect("/");
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
