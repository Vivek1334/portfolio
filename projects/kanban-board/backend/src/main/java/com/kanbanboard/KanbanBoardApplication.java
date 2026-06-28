package com.kanbanboard;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KanbanBoardApplication {

    public static void main(String[] args) {
        SpringApplication.run(KanbanBoardApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(TaskRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Task("Integrate Spring Boot APIs", "Build CRUD REST endpoints for task tracker and hook them up to React", "high", TaskStatus.IN_PROGRESS));
                repository.save(new Task("Design UI Layout", "Sketch a minimal glassmorphic layout for the portfolio and sub-projects", "low", TaskStatus.DONE));
                repository.save(new Task("Configure H2 Database", "Configure application.properties to enable the in-memory H2 database", "medium", TaskStatus.DONE));
                repository.save(new Task("Implement Interactive Boards", "Add column transition triggers so users can move cards easily", "high", TaskStatus.TODO));
                repository.save(new Task("Write Unit Tests", "Implement mock MVC tests for the task controller validation rules", "medium", TaskStatus.TODO));

                System.out.println("Initialized H2 Database with 5 demo task cards.");
            }
        };
    }
}
