var express = require('express');
var router = express.Router();

// import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    // query
    connection.query('SELECT * FROM tbl_08_post ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            // render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        title: '',
        content: ''
    });
});

router.post('/store', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to add.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content
        });
    }

    if (content.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content
        });
    }

    // if no error
    if (!errors) {
        let formData = {
            title: title,
            content: content
        };

        // insert query
        connection.query('INSERT INTO tbl_08_post SET ?', formData, function (err, result) {
            if (err) {
                req.flash('error', err);
                // render to add.ejs
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content
                });
            } else {
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        });
    }
});

/**
 * EDIT POST
 */
router.get('/edit/:id', function (req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM tbl_08_post WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err;

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan");
            res.redirect('/posts');
        }
        // if post found
        else {
            res.render('posts/edit', {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content
            });
        }
    });
});

/**
 * UPDATE POST
 */
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Title");
        res.render('posts/edit', {
            id: req.params.id,
            title: title,
            content: content
        });
    }

    if (content.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Konten");
        res.render('posts/edit', {
            id: req.params.id,
            title: title,
            content: content
        });
    }

    if (!errors) {
        let formData = {
            title: title,
            content: content
        };

        // update query
        connection.query('UPDATE tbl_08_post SET ? WHERE id = ' + id, formData, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('posts/edit', {
                    id: req.params.id,
                    title: formData.title,
                    content: formData.content
                });
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        });
    }
});

router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    connection.query('DELETE FROM tbl_08_post WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/posts')
        } else {
            req.flash('success', 'Data berhasil dihapus!')
            res.redirect('/posts')
        }
    })
})

module.exports = router;
