const date = require('../../utils/date');
const Instructor = require('../models/Instructor');

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;

        let offset = limit * (page -1) < 0 ? 0 : limit * (page -1);

        console.log(offset);
        
        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors){
                return res.render("instructors/index", {instructors, filter})
            }
        }

        Instructor.paginate(params)
        
        // if (filter) {
        //     Instructor.findBy(filter, instructors => {
        //         return res.render("instructors/index", {instructors, filter})
        //     })
        // }else {
        //     Instructor.all(instructors => {
        //         return res.render('instructors/index', {instructors, filter});
        //     });        
        // }

    },    
    create(req, res) {
        return res.render('instructors/create');
    },
    post(req, res) {
        const keys = Object.keys(req.body);
    
        for(key of keys){
            if (req.body[key] == "")
                res.send('por favor preencha todos os campos!')
        }
        Instructor.create(req.body, instructor => {
            return res.redirect(`/instructors/${instructor.id}`)
        })
        
    },
    show(req, res) {
        Instructor.find( req.params.id, (instructor) => { 
            if (!instructor) return res.send('Instructor not found!');

            instructor.age = date.getAge(instructor.birth);
            instructor.services = instructor.services.split(',');

            instructor.created_at = date.getDate(instructor.created_at).format;

            return res.render('instructors/show', {instructor})
        });
    },
    edit(req, res) {
        Instructor.find( req.params.id, (instructor) => { 
            if (!instructor) return res.send('Instructor not found!');

            instructor.birth = date.getDate(instructor.birth).iso;
            instructor.services = instructor.services.split(',');

            instructor.created_at = date.getDate(instructor.created_at).format;

            return res.render('instructors/edit', {instructor})
        });
    },
    put(req, res) {
        const keys = Object.keys(req.body);
    
        for(key of keys){
            if (req.body[key] == "")
                res.send('por favor preencha todos os campos!')
        }
        
        Instructor.update(req.body, () => {
            return res.redirect(`/instructors/${req.body.id}`)
        });
    },
    delete(req, res) {
        Instructor.delete(req.body.id, () => {
            return res.redirect('/instructors');
        })
    },
}
