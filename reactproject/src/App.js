
import RegistrationForm from './Components/RegistrationForm';
import './Components/RegistrationForm.css'
import {StudentList} from './Components/StudentList';

function App() {
  return (
    <div className="main-container">
        <RegistrationForm/>
        <StudentList/>
    </div>
   
  );
}

export default App;
