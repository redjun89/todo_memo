const express = require('express');
const Todo = require('../models/todo.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile("Hi");
});

router.post("/todos", async (req, res) => {
    const {value} = req.body;
    const maxOderByUserId = await Todo.findOne().sort("-order").exec();

    const order = maxOderByUserId ? 
        maxOderByUserId.order + 1 : // maxOderByUserId 값이 있을 때 +1 할당
        1; // maxOderByUserId 값이 없을 때 1을 할당

    const todo = new Todo({value, order});
    await todo.save();

    res.send({todo});
});

module.exports = router;