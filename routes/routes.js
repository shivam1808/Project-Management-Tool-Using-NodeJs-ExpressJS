const express = require('express');
const router = express.Router();
const Project = require('../models/projects');
const multer = require('multer');
const { route } = require('express/lib/application');
const res = require('express/lib/response');
const req = require('express/lib/request');
const fs = require("fs");


// Image Upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert a project into database

router.post('/add', upload, (req, res) => {
    const project = new Project({
        projectName: req.body.name,
        projectDescription: req.body.description,
        techUsed: req.body.tech,
        projectLink: req.body.link,
        projectImage: req.file.filename,
    });
    project.save((err) => {
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else{
            req.session.message = {
                type: 'success',
                message: "Project Added Successfully!"
            };
            res.redirect("/");
        }
    });
})

// Get all users route
router.get('/', (req, res) => {
    Project.find().exec((err, projects) => {
        if(err){
            res.json({message: err.message});
        } else {
            res.render("index", {
                title: "Home Page",
                projects: projects,
            });
        }
    });
}); 

router.get('/add', (req, res) => {
    res.render("add_project", {title: "Add project"});
}); 

// Edit a project route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    Project.findById(id, (err, project) => {
        if(err){
            res.redirect('/');
        } else{
            if(project == null){
                res.redirect('/');
            } else {
                res.render('edit_projects', {
                    title: "Edit Project",
                    project: project,
                });
            }
        }
    });
});

// Update User Route
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch(err){
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    Project.findByIdAndUpdate(id, {
        projectName: req.body.name,
        projectDescription:req.body.description,
        techUsed: req.body.tech,
        projectLink: req.body.link,
        projectImage: new_image,
        created: Date.now(),
    }, (err, result) => {
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: "success",
                message: "Project updated successfully",
            };
            res.redirect("/");
        }
    })
});

//Delete Project Route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    Project.findByIdAndRemove(id, (err, result) => {
        if(result.projectImage != ''){
            try{
                fs.unlinkSync('./uploads/' + result.projectImage);
            } catch(err){
                console.log(err);
            }
        }

        if(err){
            res.json({message: err.message});
        } else {
            req.session.message = {
                type: "info",
                message: "Project deleted successfully",
            };
            res.redirect("/");
        }

    });
});

module.exports = router;