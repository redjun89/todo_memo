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

router.get("/todos", async (req, res) => {
    const todos = await Todo.find().sort("-order").exec();

    res.send({todos});
});

router.patch("/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    const {order} = req.body;

    const currentTodo = await Todo.findById(todoId);
    if (!currentTodo) {
        return res.status(400).json({"errorMessage": "존재하지 않는 할 일 입니다."})
    }

    if (order) {
        const targetTodo = await Todo.findOne({order}).exec();
        if(targetTodo) {
            targetTodo.order = currentTodo.order;
            await targetTodo.save();
        }
        currentTodo.order = order;
        await currentTodo.save();
    }

    res.send();
})

module.exports = router;