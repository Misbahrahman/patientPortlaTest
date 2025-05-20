import { useState } from "react";
import PatientCard from "./components/patientCard";
import PatientModal from "./components/patientModal";
import { initialPatients } from "./Data/dummyData";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState('');

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = () => {
    console.log(query);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const savePatient = (newPatient) => {
    setPatients([...patients , newPatient]);
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <section className="header">
        <div className="query-container">
          <h2>Write your query</h2>
          <div className="search-controls">
            <input 
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search patients..."
            />
            <button className="execute-button" onClick={executeQuery}>
              Execute
            </button>
          </div>
        </div>
        
        <button className="new-patient-button" onClick={() => setIsModalOpen(true)}>
          Add New Patient
        </button>
      </section>
      
      <section className="card-container">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </section>
      <PatientModal
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={savePatient} 
      />
    </div>
  );
}

export default App;