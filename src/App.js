import React from "react";
import POS from "./POS";
import { retrieveLinklyData } from "./SecretManager";

const App = () => {
  const linklyData = retrieveLinklyData();

  return (
    <div className="App">
      <header className="App-header">
        <p>Linkly</p>
      </header>

      <div className="App-body">
        <div className="main-div">
          <div className="card voffset1">
            <div className="card-header center-align">
              <h2 className="no-margin">REST POS Demo</h2>
            </div>
            <POS linklyData={linklyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
