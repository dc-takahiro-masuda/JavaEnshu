package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {
	@Autowired
    private TodoRepository todoRepository;

    public void saveTodo(Todo todo) {
    	System.out.println("new todo: " + todo);
        todoRepository.save(todo);
    }
    
    public List<Todo> getAllTodos() {
    	List<Todo> allTodo = todoRepository.findAll();
    	System.out.println(allTodo);
    	return todoRepository.findAll();
    }
    
    public void findAndUpdate(int id,Todo newTodo) {
    	Todo target = todoRepository.findById(id).orElse(null);
    	System.out.println(newTodo);
    	target.setName(newTodo.getName());
    	target.setDone(newTodo.isDone());
    	target.setDeadline(newTodo.getDeadline());
    	todoRepository.save(target);
    }
    
    public void delete(int id) {
    	todoRepository.deleteById(id);
    }
}
