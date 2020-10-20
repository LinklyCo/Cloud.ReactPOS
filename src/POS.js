import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const PAIRING_MENU = "PAIRING_MENU";
const POS_SALE_UI = "POS_SALE_UI";

const pairingPath =
  "https://auth.sandbox.cloud.pceftpos.com/v1/pairing/cloudpos";
const tokenRequestPath =
  "https://auth.sandbox.cloud.pceftpos.com/v1/tokens/cloudpos";
const posName = "React REST POS";
const posVersion = "1.0.0";
const posId = "f818d27b-c98c-4007-97f5-6eb173bb7d9b";
const posVendorId = "482c12c7-4506-482e-a05a-761c113c9a40";
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const POS = () => {
  const [displayPage, setDisplayPage] = useState(PAIRING_MENU);
  const [username, setUsername] = useState("13500322002");
  const [password, setPassword] = useState("3JU662RTWBU7B6R0");
  const [pairCode, setPairCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState();
  const [tokenExpiry, setTokenExpiry] = useState();
  const [paired, setPaired] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (paired) setDisplayPage(POS_SALE_UI);
  }, [paired]);

  useEffect(() => {
    if (secret !== "") getToken();
  }, [secret]);

  const handleMenuChange = (e) => {
    if (e.target.value === "pairing") setDisplayPage(PAIRING_MENU);
    else if (e.target.value === "sale") setDisplayPage(POS_SALE_UI);
  };

  const handleClientIdChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePairingCodeChange = (e) => {
    setPairCode(e.target.value);
  };

  const sendPairRequest = (params) => {
    axios
      .post(
        pairingPath,
        {
          username,
          password,
          pairCode,
        },
        headers
      )
      .then((response) => {
        console.log("response :", response);
        setSecret(response.data.secret);
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });
  };

  const getToken = () => {
    console.log("secret :>> ", secret);
    axios
      .post(
        tokenRequestPath,
        {
          secret,
          posName,
          posVersion,
          posId,
          posVendorId,
        },
        headers
      )
      .then((response) => {
        console.log("response :", response);
        setToken(response.data.token);
        setTokenExpiry(response.data.expirySeconds);
        setPaired(true);
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });
  };

  let display;
  switch (displayPage) {
    case PAIRING_MENU:
      display = (
        <form>
          <div className="form-group">
            <label htmlFor="clientIdInput">Client ID: </label>
            <input
              className="form-control w-75"
              id="clientIdInput"
              onChange={handleClientIdChange}
              value={username}
              placeholder="Linkly Cloud Client ID"
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password: </label>
            <input
              className="form-control w-75"
              id="passwordInput"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="pairingCodeInput">Pairing Code: </label>
            <input
              className="form-control w-75"
              id="pairingCodeInput"
              onChange={handlePairingCodeChange}
              value={pairCode}
              placeholder="Pairing code from pinpad"
            ></input>
          </div>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={sendPairRequest}
          >
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

  const POSOutput = (
    <p>
      <b>Pinpad Status: </b> {paired ? "Connected!" : "Offline"}
    </p>
  );

  // TODO: UX friendly way to configure PAD tags and Linkly basket

  return (
    <div className="card-body card-div ">
      <div className="row pos-card">
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
        <div className="col pos-output">{POSOutput}</div>
      </div>
    </div>
  );
};

export default POS;
