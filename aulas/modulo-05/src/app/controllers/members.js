const date = require('../../utils/date');
const Member = require('../models/Member');

module.exports = {
    index(req, res) {
        Member.all(members => {
            return res.render('members/index', {members});
        });        
    },    
    create(req, res) {
        Member.instructorsSelectOptions( options => {
            console.log(options);
            
            return res.render('members/create', { instructorOptions: options });

        })
    },
    post(req, res) {
        const keys = Object.keys(req.body);
    
        for(key of keys){
            if (req.body[key] == "")
                res.send('por favor preencha todos os campos!')
        }
        Member.create(req.body, member => {
            return res.redirect(`/members/${member.id}`)
        })
        
    },
    show(req, res) {
        Member.find( req.params.id, (member) => { 
            if (!member) return res.send('Member not found!');

            member.birth = date.getDate(member.birth).birthDay;

            return res.render('members/show', {member})
        });
    },
    edit(req, res) {
        Member.find( req.params.id, (member) => { 
            if (!member) return res.send('Member not found!');

            member.birth = date.getDate(member.birth).iso;

            Member.instructorsSelectOptions( options => {
                console.log(options);
                
                return res.render('members/edit', { member, instructorOptions: options});
            });
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body);
    
        for(key of keys){
            if (req.body[key] == "")
                res.send('por favor preencha todos os campos!')
        }
        
        Member.update(req.body, () => {
            return res.redirect(`/members/${req.body.id}`)
        });
    },
    delete(req, res) {
        Member.delete(req.body.id, () => {
            return res.redirect('/members');
        })
    },
}
