#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";
import * as fs from "node:fs";
import Task from "./@types/task";
console.log(
  chalk.green(figlet.textSync("Task Tracker", { horizontalLayout: "full" })),
);

program
  .name("task-tracker")
  .version("1.0.0")
  .description(
    "Build a CLI app to track your tasks and manage your to-do list",
  );

program
  .command("list")
  .description("List all tasks")
  .action(() => {
    console.log(chalk.blue("Listing all tasks..."));
    const tasksData = fs.readFileSync("src/tasks.json", "utf-8");
    const tasks = JSON.parse(tasksData);
    tasks.forEach((task: Task) => {
      console.log(
        chalk.yellow(
          `ID: ${task.id}, Task: ${task.task}, Due Date: ${task.dueDate}, Priority: ${task.priority}, Completed: ${task.completed}`,
        ),
      );
    });
  });

program
  .command("add")
  .description("Add a new task")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "task",
          message: "Enter a new task:",
        },
        {
          type: "input",
          name: "dueDate",
          message: "Enter due date (YYYY-MM-DD):",
          default: () => {
            const today = new Date();
            return today.toISOString().split("T")[0];
          },
        },
        {
          type: "select",
          name: "priority",
          message: "Select priority:",
          choices: ["Low", "Medium", "High"],
        },
        {
          type: "confirm",
          name: "completed",
          message: "Is the task completed?",
          default: false,
        },
      ])
      .then((answers) => {
        const tasksData = fs.readFileSync("src/tasks.json", "utf-8");
        const tasks = JSON.parse(tasksData);
        const newTask = {
          id: tasks.length + 1,
          task: answers.task,
          dueDate: answers.dueDate,
          priority: answers.priority,
          completed: answers.completed,
        };
        tasks.push(newTask);
        fs.writeFileSync("src/tasks.json", JSON.stringify(tasks, null, 2));
        console.log(chalk.green("Task added successfully!"));
      });
  });

program
  .command("remove <taskId>")
  .description("Remove a task")
  .action((taskId) => {
    if (isNaN(Number(taskId))) {
      console.log(chalk.red(`Invalid task ID: ${taskId}`));
      return;
    }
    const tasksData = fs.readFileSync("src/tasks.json", "utf-8");
    const tasks = JSON.parse(tasksData);
    const taskIndex = tasks.findIndex(
      (task: Task) => task.id === Number(taskId),
    );
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      fs.writeFileSync("src/tasks.json", JSON.stringify(tasks, null, 2));
      console.log(chalk.green(`Task ${taskId} removed successfully.`));
    } else {
      console.log(chalk.red(`Task with ID ${taskId} not found.`));
    }
  });

program
  .command("complete <taskId>")
  .description("Mark a task as complete")
  .action((taskId) => {
    console.log(chalk.yellow(`Completing task: ${taskId}`));
    const tasksData = fs.readFileSync("src/tasks.json", "utf-8");
    const tasks = JSON.parse(tasksData);
    const taskIndex = tasks.findIndex(
      (task: Task) => task.id === Number(taskId),
    );
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = true;
      fs.writeFileSync("src/tasks.json", JSON.stringify(tasks, null, 2));
      console.log(chalk.green(`Task ${taskId} marked as complete.`));
    } else {
      console.log(chalk.red(`Task with ID ${taskId} not found.`));
    }
  });

program
  .command("update <taskId> <newTask>")
  .description("Update a task")
  .action((taskId, newTask) => {
    console.log(chalk.cyan(`Updating task ${taskId} to: ${newTask}`));
    const tasksData = fs.readFileSync("src/tasks.json", "utf-8");
    const tasks = JSON.parse(tasksData);
    const taskIndex = tasks.findIndex(
      (task: Task) => task.id === Number(taskId),
    );
    if (taskIndex !== -1) {
      tasks[taskIndex].task = newTask;
      fs.writeFileSync("src/tasks.json", JSON.stringify(tasks, null, 2));
      console.log(chalk.green(`Task ${taskId} updated successfully.`));
    } else {
      console.log(chalk.red(`Task with ID ${taskId} not found.`));
    }
  });

program.parse(process.argv);
