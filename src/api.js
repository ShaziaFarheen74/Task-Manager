// api.js

export const fetchTasks = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();
    return data.slice(0, 20);  // Return first 20 tasks
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error('Failed to fetch tasks');
  }
};

export const CreateTask = async (task) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: true, message: "Task created successfully", task: data };
  } catch (err) {
    console.error("Error creating task:", err);
    return { success: false, message: 'Failed to create task' };
  }
};

export const deleteTask = async (taskId) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: 'DELETE',
    });

    return { success: true, message: 'Task deleted successfully' };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { success: false, message: 'Failed to delete task' };
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: status === 'Done' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: true, message: 'Task updated successfully', task: data };
  } catch (err) {
    console.error("Error updating task:", err);
    return { success: false, message: 'Failed to update task' };
  }
};




