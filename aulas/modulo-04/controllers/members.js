const fs = require('fs');
const data = require('../data.json');
const date = require('../utils/date');

exports.index = (req, res) => {
    return res.render('members/index', { members: data.members });
}

exports.show = (req, res) => {
    const { id } = req.params;
    
    const foundMember = data.members.find((member) => {
        return member.id == id;
    });
    
    if (!foundMember) {
        return res.send('Member not found!');
    }

    const member = {
        ...foundMember,
        birth: foundMember.birth!=undefined ? date.getDate(foundMember.birth).birthDay : "",
    }


    return res.render('members/show', {member});
}

exports.create = (req, res) => {
    return res.render('members/create');
}

exports.posts = (req, res) => {
    const keys = Object.keys(req.body);
    
    for(key of keys){
        if (req.body[key] == "")
            res.send('Por favor preencha todos os campos!')
    }

    
    const birth = Date.parse(req.body.birth);

    let id = 1;
    
    const lasMember = data.members[data.members.length -1];
    
    if (lasMember) {
        id = lasMember.id + 1;                
    }
    
    data.members.push({
        id,
        ...req.body,  
        birth
    });

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
        if (error) return res.send("Write file error")

        return res.redirect(`/members/${id}`);
    });

}

exports.edit = (req, res) => {
    const { id } = req.params;

    const foundMember = data.members.find((member) => {
        return member.id == id;
    });

    const member = {
        ...foundMember,
        birth: date.getDate(foundMember.birth).iso,
    }

    if (!foundMember) {
        return res.send('Member not found!');
    }

    return res.render('members/edit', {member});
}

exports.put = (req, res) => {
    const { id } = req.body;
    let index = 0;

    const foundMember = data.members.find((Member, foundIndex) => {
        if (Member.id == id){
            index = foundIndex;
            return true;
        }
    });
    
    if (!foundMember) return res.send('Member not found!');

    const Member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

    data.members[index] = Member;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if(err) return res.send('write error!');

        return res.redirect(`/members/${id}`);
    })
}

exports.delete = (req, res) => {
    const { id } = req.body;
    
    const filteredMembers = data.members.filter( function(member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return  res.send('write error!')

        return res.redirect("/members");
    });
}