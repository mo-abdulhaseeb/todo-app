import './App.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ywcpflqujcjldicjywpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y3BmbHF1amNqbGRpY2p5d3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzA5OTMsImV4cCI6MjA2MzUwNjk5M30.gUU7Mhoc2qhVcqU6tthXjsA2AVssrNcFplkmSn9pXys'
);

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase.from('todos').select('*').order('id', { ascending: true });
    setTasks(data);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await supabase.from('todos').insert([{ text: newTask, completed: false }]);
    setNewTask('');
    fetchTasks();
  }

  async function toggleTask(task) {
    await supabase.from('todos').update({ completed: !task.completed }).eq('id', task.id);
    fetchTasks();
  }

  async function deleteTask(id) {
    await supabase.from('todos').delete().eq('id', id);
    fetchTasks();
  }
   return (
  <div className="container">
    <h2>My To-Do List</h2>
    <input
      value={newTask}
      onChange={e => setNewTask(e.target.value)}
      placeholder="Enter task"
    />
    <button onClick={addTask}>Add</button>
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <span
            onClick={() => toggleTask(task)}
            className={task.completed ? 'completed' : ''}
          >
            {task.text}
          </span>
          <button onClick={() => deleteTask(task.id)}>❌</button>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default App;
