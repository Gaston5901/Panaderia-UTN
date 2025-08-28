import './App.css';
import Login from './components/Login'; // Importa el componente de login

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Aplicación de React</h1>
        <Login /> {/* Renderiza el componente de login aquí */}
      </header>
    </div>
  );
}

export default App;