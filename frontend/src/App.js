import logo from './image_todo.gif';
import Todo from './TodoList';
import Weather from './weather_check';
import './App.css';

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        <h1>Here we will handle all our family tasks (:</h1>
      </p>
      <Todo/>
      <Weather/>
    </div>
    
  );
}

export default App;
