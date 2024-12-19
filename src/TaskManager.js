import React, { useState, useEffect } from 'react';
import {  FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { CreateTask, fetchTasks, deleteTask, updateTaskStatus } from './api';
import { useTable } from 'react-table';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [taskCounters, setTaskCounters] = useState({ ToDo: 0, InProgress: 0, Done: 0 });
  const [filterStatus, setFilterStatus] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      updateTaskCounters(data);
    } catch (err) {
      toast.error("Error fetching tasks");
    }
  };

  const updateTaskCounters = (tasks) => {
    const counters = { ToDo: 0, InProgress: 0, Done: 0 };
    tasks.forEach((task) => {
      if (task.completed) {
        counters.Done++;
      } else {
        counters.ToDo++;
      }
    });
    setTaskCounters(counters);
  };

  const handleAddTask = async () => {
    if (!input) return;
    const task = { title: input, completed: false };
    try {
      const { success, message, task: newTask } = await CreateTask(task);
      if (success) {
        toast.success(message);
        setTasks([...tasks, newTask]);
        updateTaskCounters([...tasks, newTask]);
      } else {
        toast.error(message);
      }
      setInput('');
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const { success, message } = await deleteTask(taskId);
      if (success) {
        toast.success(message);
        setTasks(tasks.filter(task => task.id !== taskId));
        updateTaskCounters(tasks.filter(task => task.id !== taskId));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleTaskUpdate = async (taskId, status) => {
    try {
      const { success, message } = await updateTaskStatus(taskId, status);
      if (success) {
        toast.success(message);
        loadTasks(); // Reload tasks to reflect updated status
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleSaveEdit = async (taskId) => {
    if (!editedTitle || !editedDescription || !editedStatus) return;
    try {
      const updatedTask = { id: taskId, title: editedTitle, description: editedDescription, status: editedStatus };
      const { success, message } = await updatedTask(updatedTask);
      if (success) {
        toast.success(message);
        loadTasks(); // Reload tasks to reflect updated data
        setEditingTaskId(null); // Exit edit mode
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Task ID',
        accessor: 'id', // Accessor for task ID
      },
      {
        Header: 'Title',
        accessor: 'title', // Accessor for task title
        Cell: ({ row }) => (
          editingTaskId === row.original.id ? (
            <input
              type='text'
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className='form-control'
            />
          ) : (
            row.values.title
          )
        ),
      },
      {
        Header: 'Description',
        accessor: 'description', // Accessor for task description
        Cell: ({ row }) => (
          editingTaskId === row.original.id ? (
            <input
              type='text'
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className='form-control'
            />
          ) : (
            row.values.description
          )
        ),
      },
      {
        Header: 'Status',
        accessor: 'status', // Accessor for task status
        Cell: ({ row }) => (
          editingTaskId === row.original.id ? (
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className='form-select'
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          ) : (
            row.values.status
          )
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            {editingTaskId === row.original.id ? (
              <button
                className='btn btn-success btn-sm me-2'
                onClick={() => handleSaveEdit(row.original.id)}
              >
                Save
              </button>
            ) : (
              <button
                className='btn btn-primary btn-sm me-2'
                onClick={() => setEditingTaskId(row.original.id)}
              >
                <FaPencilAlt />
              </button>
            )}
            <button
              className='btn btn-danger btn-sm me-2'
              onClick={() => handleTaskDelete(row.original.id)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editedTitle, editedDescription, editedStatus, editingTaskId]
  );

  const data = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className='d-flex flex-column align-items-center w-75 m-auto mt-5'>
      <h1 className='mb-4'>TASK LIST MANAGER</h1>

      {/* Input and search box */}
      <div className='d-flex justify-content-between align-items-center mb-4 w-100'>
        <div className='input-group flex-grow-1 me-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='form-control me-1'
            placeholder='Add New Task'
          />
          <button
            className='btn btn-success btn-sm me-2'
            onClick={handleAddTask}
          >
            <FaPlus className='m-2' />
          </button>
        </div>
        <div className='input-group flex-grow-1'>
          <span className='input-group-text'>
            <FaSearch />
          </span>
          <input
            type='text'
            className='form-control'
            value={search}
            onChange={handleSearchChange}
            placeholder='Search tasks'
          />
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-3">
        <select
          className="form-select"
          value={filterStatus}
          onChange={handleStatusFilterChange}
        >
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Task Counter */}
      <div className='mb-3'>
        <span>To Do: {taskCounters.ToDo} | In Progress: {taskCounters.InProgress} | Done: {taskCounters.Done}</span>
      </div>

      {/* Task Table */}
      <div className='table-responsive'>
        <table className='table' {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toastify */}
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TaskManager;
