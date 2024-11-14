import React from 'react'
import IonIcon from '@reacticons/ionicons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Todo.css';
import TodoItem from '../components/TodoItem';

function Todo() {
  // js goes here
	const [todosList,setTodosList] = useState([]);
	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/todos')
		.then((res) => {
	 	console.log(res.data);
	 	setTodosList(res.data);
		});
	},[]);

	function deleteTodo(idx){
		const todoItem = todosList[idx];
		console.log(`deleting todo item with idx=${idx}`);
		console.log(`deleting todo item ${todoItem}`);
		axios.delete(`http://localhost:8000/api/v1/todos/delete-by-title/${todoItem.title}`)
		.then((res) => {
			console.log(res.data);
			console.log(todosList); // 3
			//todosList.splice(idx,1); // in place update of array via a delete
			const todoListLatest = todosList.filter((todo) => (todo.title !== todosList[idx].title));
			/*const todoListLatest = [...todosList];
			todoListLatest.splice(idx,1); */

			console.log(todoListLatest); // 2
			setTodosList(todoListLatest);
		 });
		 
	}
	function updateTodo(idx){
		const todoItem = todosList[idx];
		const todoItemUpdated = {};
		console.log(`updating todo item with idx=${idx}`);
		console.log(`updating todo item ${todoItem}`);
		axios.put('http://localhost:8000/api/v1/todos',todoItemUpdated)
		.then((res) => {	setTodosList([...todosList,todoItem]);});
		 
	}
	function addTodo(e){
		e.preventDefault();
		console.log(e);
		const todoItem = {'title':e.target[0].value
			               ,'desc':e.target[1].value
										 ,'status':e.target[2].value}
	  e.target[0].value = '' //title
		e.target[1].value = '' // desc
		e.target[2].value = '' // status
		axios.post('http://localhost:8000/api/v1/todos',todoItem)
		.then((res) => {	setTodosList([...todosList,todoItem]);});
	}


	return (
    <div className="Todo"> 
			<form className='Add_Todo' onSubmit={(e) => addTodo(e)}>
				<input id = "add_todo_title_input" name="add_todo_title_input" placeholder='Enter title here'></input>
				<input id = "add_todo_desc_input" name="add_todo_desc_input" placeholder='Enter description here'></input>
				<input id = "add_todo_status_input" name="add_todo_status_input" placeholder='Enter status here'></input>
				<button id = "add-todo-btn" type="submit">
					<IonIcon id = "add-todo-img" name='add-circle'></IonIcon>
				</button>
			</form>
			<h1>Todos</h1>
			{/*<p>{todosList}</p>*/}
			{ 
			todosList.map((todo,idx) => 
			<TodoItem idx={idx} deleteTodo = {deleteTodo} updateTodo = {updateTodo} {...todo} />)
			}
    </div>
  );
}

export default Todo