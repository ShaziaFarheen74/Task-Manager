# Task Manager

A simple React-based task management system that allows users to create, read, update, delete, search, and filter tasks by status. It provides a table to manage tasks and displays task counters for different statuses (`To Do`, `In Progress`, and `Done`).

## Features

- **Add Tasks**: Users can add new tasks with a title and description.
- **Edit Tasks**: Users can edit the title, description, and status of tasks.
- **Delete Tasks**: Tasks can be deleted from the list.
- **Search Tasks**: Filter tasks by title or description using the search bar.
- **Filter by Status**: Users can filter tasks based on their current status (`To Do`, `In Progress`, `Done`).
- **Task Counter**: Displays the count of tasks for each status.
- **Toast Notifications**: Provides success/error messages for task actions (e.g., task creation, update, delete).

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **React Table**: A lightweight and flexible table library for displaying task data.
- **React Icons**: For using icons (e.g., pencil for editing, trash can for deleting).
- **React Toastify**: For displaying toast notifications (success/error messages).
- **CSS (Bootstrap)**: For styling the components.
- 
- API
This project interacts with the following API functions:

fetchTasks(): Fetches the list of tasks from the server.
CreateTask(task): Sends a request to create a new task.
deleteTask(taskId): Deletes a task by its ID.
updateTaskStatus(taskId, status): Updates the status of a task.
updatedTask(updatedTask): Updates the title, description, and status of a task.
Note: The API methods (fetchTasks, CreateTask, deleteTask, updateTaskStatus, updatedTask) need to be implemented in the api.js file or the equivalent backend service.

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/task-manager.git

