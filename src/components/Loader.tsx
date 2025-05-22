import React from 'react';


const Loader = ({ message = '' }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;