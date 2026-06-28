package com.expensetracker;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(TransactionRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                String today = LocalDate.now().toString();
                String yesterday = LocalDate.now().minusDays(1).toString();
                String lastWeek = LocalDate.now().minusDays(5).toString();

                repository.save(new Transaction("Monthly Salary", 4500.0, "Salary", lastWeek, "income"));
                repository.save(new Transaction("Apartment Rent", 1200.0, "Housing", lastWeek, "expense"));
                repository.save(new Transaction("Grocery Supermarket", 165.5, "Food", yesterday, "expense"));
                repository.save(new Transaction("Freelance Web Design", 850.0, "Freelance", yesterday, "income"));
                repository.save(new Transaction("Fitness Club Membership", 45.0, "Health", today, "expense"));
                repository.save(new Transaction("Coffee Shop", 8.5, "Food", today, "expense"));

                System.out.println("Initialized H2 Database with 6 demo transactions.");
            }
        };
    }
}
