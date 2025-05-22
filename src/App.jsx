import { useEffect, useState } from "react";
import PatientCard from "./components/patientCard";
import PatientModal from "./components/patientModal";
import { PGlite } from "@electric-sql/pglite";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [db, setDb] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = async () => {
    if (!db) return;

    try {
      const res = await db.exec(query);
      const patientsList = res[0].rows.map((row) => row);
      setPatients(patientsList);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const savePatient = async (newPatient) => {
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


  const feedData = async (patientData) => {
    await db.exec(
      `
    INSERT INTO patients (firstName, lastName, dateOfBirth, gender, contactNumber, email)
    VALUES ($1, $2, $3, $4, $5, $6);
  `,
      [
        patientData.firstName,
        patientData.lastName,
        patientData.dateOfBirth,
        patientData.gender,
        patientData.contactNumber,
        patientData.email,
      ]
    );
  };

  const updatePatients = async () => {
    if (!db) return;

    try {
      const res = await db.exec("SELECT * FROM patients;");
      const patientsList = res[0].rows.map((row) => row);
      setPatients(patientsList);
    } catch (error) {
      alert("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const initDb = async () => {
      try {
        const dbInstance = new PGlite("idb://patient-db-test1");
        await dbInstance.waitReady;
        setDb(dbInstance);

        console.log("Database connection established", dbInstance);

        setIsDbReady(true);
      } catch (error) {
        console.error("Database initialization failed:", error);
      }
    };

    const autoRefreshOnDataUpdates = (event) => {
      if (event.key === "newPatient") {
        //Will RELOAD the page here for multiple tabs sync
        window.location.reload(); 
      }
    };

    window.addEventListener("storage", autoRefreshOnDataUpdates);

    initDb();
  }, []);

  

  useEffect(() => {
    const feedTable = async () => {
      await addOrCheckTable();
    };

    if (isDbReady) {
      feedTable();
      updatePatients();
    }
  }, [db, isDbReady]);



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
