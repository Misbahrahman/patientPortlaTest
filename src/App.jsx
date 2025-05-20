import { useState } from "react";
import PatientCard from "./patientCard";

const initialPatients = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    contactNumber: '(555) 123-4567',
    email: 'john.doe@example.com'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-08-22',
    gender: 'Female',
    contactNumber: '(555) 987-6543',
    email: 'jane.smith@example.com'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: '1978-03-10',
    gender: 'Male',
    contactNumber: '(555) 456-7890',
    email: 'michael.j@example.com'
  }
];

function App() {
  const [isModalOpen , setIsModalOpen] = useState(false);

  return (
    isModalOpen ? <></> : <div className="app-container">
    <section className="header">
      <div className="query-container">
        <h2>Write your query</h2>
        <div className="search-controls">
          <input 
            type="text" 
            placeholder="Search patients..."
          />
          <button className="execute-button" onClick={() => {}}>
            Execute
          </button>
        </div>
      </div>
      
      <button className="new-patient-button" onClick={() => {}}>
        Add New Patient
      </button>
    </section>
    
    <section className="card-container">
      {initialPatients.map(patient => (
       <PatientCard key = {patient.id} patient={patient} />
      ))}
    </section>
  </div>
  
  );
}

export default App;