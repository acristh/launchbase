const fs = require('fs');
const data = require('./data.json');
const date = require('./utils/date');

exports.index = (req, res) => {
    return res.render('instructors/index', { instructors: data.instructors });
}

exports.show = (req, res) => {
    const { id } = req.params;

    console.log(date);
    
    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id;
    });
    
    if (!foundInstructor) {
        return res.send('Instructor not found!');
    }

    const instructor = {
        ...foundInstructor,
        age: foundInstructor.birth!=undefined ? date.getAge(foundInstructor.birth) : "",
        services: foundInstructor.services.split(','),
        created_at: new Intl.DateTimeFormat('en-GB').format(foundInstructor.created_at),
    }


    return res.render('instructors/show', {instructor});
}

exports.posts = (req, res) => {
    const keys = Object.keys(req.body);
    
    for(key of keys){
        if (req.body[key] == "")
            res.send('por favor preencha todos os campos!')
    }

    let { id, avatar_url, birth, name, services, gender, created_at } = req.body;

    birth = Date.parse(req.body.birth);
    crated_at = Date.now();
    id = Number(data.instructors.length + 1);

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    });

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
        if (error) return res.send("Write file error")

        return res.redirect('/instructors');
    });

}

exports.edit = (req, res) => {
    const { id } = req.params;

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id;
    });

    const instructor = {
        ...foundInstructor,
        birth: date.getDate(foundInstructor.birth),
    }

    if (!foundInstructor) {
        return res.send('Instructor not found!');
    }

    return res.render('instructors/edit', {instructor});
}

exports.put = (req, res) => {
    const { id } = req.body;
    let index = 0;

    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if (instructor.id == id){
            index = foundIndex;
            return true;
        }
    });
    
    if (!foundInstructor) return res.send('Instructor not found!');

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[index] = instructor;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if(err) return res.send('write error!');

        return res.redirect(`/instructors/${id}`);
    })
}

exports.delete = (req, res) => {
    const { id } = req.body;
    
    const filteredInstructors = data.instructors.filter( function(instructor) {
        return instructor.id != id;
    });

    data.instructor = filteredInstructors;

    fs.writeFile('data.json', JSON.stringify('data', null, 2), err => {
        if (err) return  res.send('write erro!')

        return res.redirect("/instructors");
    });
}