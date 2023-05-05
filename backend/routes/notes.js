const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all notes from User (copy) using: GET "/api/notes/getuser". Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

//ROUTE 2: Add a new notes from User (copy) using: POST "/api/notes/addnote". Login required

router.post("/addnote", fetchuser, [
    body('title', "Enter a Valid title").isLength({ min: 3 }),
    body('description', 'Enter a valid description. And must be atleast 5 character').isLength({ min: 5 }),
],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()
            res.json(savedNote);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error")
        }
    })


//ROUTE 3: Update an existing note from User (copy) using: PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser,
    async (req, res) => {
        const { title, description, tag } = req.body;
        try {

            // Create a newNote = {};
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            //Find the note to be updated
            let note = await Note.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("You are not allowed to update this note");
            }

            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
            res.json({ note });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error")
        }

    })

//ROUTE 4: Delete an existing note from User (copy) using: DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser,
    async (req, res) => {
        try {

            //Find the note to be deleted and delete it
            let note = await Note.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }

            // Allow Deletion only if user own this Note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("You are not allowed to update this note");
            }

            note = await Note.findByIdAndDelete(req.params.id);
            res.json({ 'Success': 'This Note has been deleted successfully : ', note: note });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error")
        }

    })

module.exports = router;