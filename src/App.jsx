import { useEffect, useState } from "react";
import PatientCard from "./components/patientCard";
import PatientModal from "./components/patientModal";
import { initialPatients } from "./Data/dummyData";
import { PGlite } from "@electric-sql/pglite";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState("");
  const [db, setDb] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = () => {
    console.log(query);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const savePatient = async (newPatient) => {
    setPatients([...patients, newPatient]);
    setIsModalOpen(false);

    if (db && isDbReady) {
      try {
        await feedData(newPatient);
      } catch (error) {
        console.error("Error saving patient to database:", error);
      }
    }
  };

  const addOrCheckTable = async () => {
    return await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      firstName TEXT,
      lastName TEXT,
      dateOfBirth TEXT,
      gender TEXT,
      contactNumber TEXT,
      email TEXT
      );
    `);
  };

  const addDummyValues = async () => {
    initialPatients.forEach(async (patient) => {
      await feedData(patient);
    });
  };

  const feedData = async (patientData) => {
    console.log(patientData);
    const result = await db.exec(
      `SELECT * FROM patients WHERE id = ${patientData.id};`
    );
    if (result) throw new Error("Id exists");

    try {
      await db.exec(`
        INSERT INTO patients (id, firstName, lastName, dateOfBirth, gender, contactNumber, email)
        VALUES (
           ${patientData.id}, 
          '${patientData.firstName}', 
          '${patientData.lastName}', 
          '${patientData.dateOfBirth.toString()}', 
          '${patientData.gender}', 
          '${patientData.contactNumber.toString()}', 
          '${patientData.email}'
        );
      `);
      console.log(
        `Patient ${patientData.firstName} ${patientData.lastName} added to database`
      );
    } catch (error) {
      console.error("Error inserting patient data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initDb = async () => {
      try {
        const dbInstance = new PGlite("idb://patient-db");
        await dbInstance.waitReady;
        setDb(dbInstance);

        console.log("Database connection established", dbInstance);

        setIsDbReady(true);
      } catch (error) {
        console.error("Database initialization failed:", error);
      }
    };

    initDb();
  }, []);

  useEffect(() => {
    const feedData = async () => {
      const tableCreated = await addOrCheckTable();

      if (tableCreated) {
        await addDummyValues();
      }
    };

    if (db) {
      feedData();
    }
  }, [isDbReady]);

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

        <button
          className="new-patient-button"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Patient
        </button>
      </section>

      <section className="card-container">
        {patients.map((patient) => (
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
