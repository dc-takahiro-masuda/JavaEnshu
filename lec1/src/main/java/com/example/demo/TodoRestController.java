package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TodoRestController {
	@Autowired
	private TodoService todoService;
	
	@PostMapping("/api/addTodo")
	public void addTodo(@RequestBody Todo postData) {
		System.out.println(postData);
		todoService.saveTodo(postData);
	}
	
	@GetMapping("/api/getAllTodo")
	public List<Todo> getAllTodo() {
		return todoService.getAllTodos();
	}
	
	@PatchMapping("/api/todos/{id}")
	public void updateTodo(@PathVariable("id") int id,@RequestBody Todo todo) {
		todoService.findAndUpdate(id,todo);
	}
	
	@DeleteMapping("/api/todos/{id}")
	public void deleteTodo(@PathVariable("id") int id) {
		todoService.delete(id);
	}
}
