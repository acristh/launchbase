const express = require('express');
const routes = express.Router();
const instructors = require('./instructors');

routes.get('/', (req, res) => {
    return res.redirect('/instructors');
});

routes.get('/instructors', instructors.index);

routes.post('/instructors', instructors.posts);

routes.get('/instructors/create', (req, res) => {
    return res.render('instructors/create');
})

routes.get('/instructors/:id', instructors.show);

routes.get('/instructors/:id/edit', instructors.edit);

routes.put('/instructors', instructors.put);

routes.delete('/instructors', instructors.delete);


routes.get('/menbers', (req, res) => {
    return res.render('menbers/index');
});

module.exports = routes;
