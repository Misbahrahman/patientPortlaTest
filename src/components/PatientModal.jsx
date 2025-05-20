import { useState } from "react";

const PatientModal = ({ isOpen, onClose, onSave }) => {
    const [patient, setPatient] = useState({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      contactNumber: '',
      email: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPatient(prevPatient => ({
        ...prevPatient,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      const newPatient = {
        ...patient,
        id: Date.now() //using date for uuid generation
      };


      onSave(newPatient);

      setPatient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        contactNumber: '',
        email: ''
      });

      
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Add New Patient</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={patient.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={patient.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={patient.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={patient.contactNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="save-button">Save Patient</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default PatientModal;  