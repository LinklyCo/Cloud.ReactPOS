import React, { useState } from "react";
import "./App.css";

const PAIRING_MENU = "PAIRING_MENU";
const POS_SALE_UI = "POS_SALE_UI";

const POS = () => {
  const [displayPage, setDisplayPage] = useState(PAIRING_MENU);
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [pairingCode, setPairingCode] = useState("");

  const handleMenuChange = (e) => {
    if (e.target.value === "pairing") setDisplayPage(PAIRING_MENU);
    else if (e.target.value === "sale") setDisplayPage(POS_SALE_UI);
  };

  const handleClientIdChange = (e) => {
    setClientId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePairingCodeChange = (e) => {
    setPairingCode(e.target.value);
  };

  let display;
  switch (displayPage) {
    case PAIRING_MENU:
      display = (
        <form>
          <div className="form-group">
            <label for="clientIdInput">Client ID: </label>
            <input
              className="form-control w-75"
              id="clientIdInput"
              onChange={handleClientIdChange}
              value={clientId}
              placeholder="Linkly Cloud Client ID"
            ></input>
          </div>
          <div className="form-group">
            <label for="passwordInput">Password: </label>
            <input
              className="form-control w-75"
              id="passwordInput"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
            ></input>
          </div>
          <div className="form-group">
            <label for="pairingCodeInput">Pairing Code: </label>
            <input
              className="form-control w-75"
              id="pairingCodeInput"
              onChange={handlePairingCodeChange}
              value={pairingCode}
              placeholder="Pairing code from pinpad"
            ></input>
          </div>
          <button type="button" className="btn btn-outline-info">
            Pair
          </button>
        </form>
      );
      break;
    case POS_SALE_UI:
      display = (
        <div className="form-group">
          <button type="button" className="btn btn-outline-info">
            Purchase
          </button>
          <button type="button" className="btn btn-outline-info">
            Refund
          </button>
        </div>
      );
      break;
    default:
      display = <p>Please refresh page</p>;
  }

  // TODO: UX friendly way to configure PAD tags and Linkly basket

  return (
    <div className="card-body card-div pos-card">
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-toggle mb-3"
            data-toggle="buttons"
          >
            <label className="btn btn-primary active">
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                onClick={handleMenuChange}
                value="pairing"
                defaultChecked
              />{" "}
              Pairing
            </label>
            <label className="btn btn-primary">
              <input
                type="radio"
                name="options"
                id="option2"
                autoComplete="off"
                onClick={handleMenuChange}
                value="sale"
              />{" "}
              Sale
            </label>
          </div>
          <br />
          <br />
          {display}
        </div>
        <div className="col">
          <p>
            Hello POS Hello POS Hello POS Hello POS Hello POS Hello POS Hello
            POS Hello POS Hello POS
          </p>
        </div>
      </div>
    </div>
  );
};

export default POS;
