import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  
import App from './App';
import './styles/index.css';  
import { Provider } from 'react-redux';
import { Store } from '../store/Store.js';
import SocketListener from './SocketListener.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(

<Provider store={Store}>

   <SocketListener/>

  <BrowserRouter>
      <App />
  </BrowserRouter>

</Provider>


);