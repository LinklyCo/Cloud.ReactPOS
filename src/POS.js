import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import "./App.css";
import { retrieveLinklyData, storeLinklyData } from "./SecretManager";

const PAIRING_MENU = "PAIRING_MENU";
const POS_SALE_UI = "POS_SALE_UI";
const TXN = "TXN";
const REPRINT_RECEIPT = "REPRINT_RECEIPT";
const TXN_STATUS = "TXN_STATUS";

const pairingPath =
  "https://auth.sandbox.cloud.pceftpos.com/v1/pairing/cloudpos";
const tokenRequestPath =
  "https://auth.sandbox.cloud.pceftpos.com/v1/tokens/cloudpos";
const linklyEndpoint =
  "https://rest.pos.sandbox.cloud.pceftpos.com/v1/sessions/";
const posName = "React REST POS";
const posVersion = "1.0.0";
const posId = "f818d27b-c98c-4007-97f5-6eb173bb7d9b";
const posVendorId = "482c12c7-4506-482e-a05a-761c113c9a40";
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const POS = (props) => {
  const [displayPage, setDisplayPage] = useState(PAIRING_MENU);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState();
  const [tokenExpiry, setTokenExpiry] = useState();
  const [paired, setPaired] = useState(false);
  const [txnResponse, setTxnResponse] = useState();
  const [lastSessionId, setLastSessionId] = useState();
  const [amtPurchase, setAmtPurchase] = useState(100);
  const [amtCash, setAmtCash] = useState(0);

  console.log("paired :>> ", paired);

  useEffect(() => {
    setSecret(retrieveLinklyData("secret"));
    setToken(retrieveLinklyData("token"));
    setTokenExpiry(retrieveLinklyData("token-expiry"));
  }, []);

  useEffect(() => {
    console.log("DETECTING PAIRED");
    if (paired) setDisplayPage(POS_SALE_UI);
  }, [paired]);

  useEffect(() => {
    console.log("SECRET NOTED BY EFFECT");
    if (secret) {
      console.log("SECRET NOT NULL... STORING...");
      storeLinklyData("secret", secret);
      if (!token || tokenExpiry <= Date.now() || !paired) {
        console.log("GETTING TOKEN");
        getToken();
      } else {
        console.log("SETTING PAIRED");
        setPaired(true);
      }
    }
  }, [secret]);

  useEffect(() => {
    if (token !== "" && tokenExpiry) {
      storeLinklyData("token", token);
      storeLinklyData("token-expiry", tokenExpiry);
    }
  }, [token, tokenExpiry]);

  const handleMenuChange = (e) => {
    if (e.target.value === "pairing") setDisplayPage(PAIRING_MENU);
    else if (e.target.value === "sale") setDisplayPage(POS_SALE_UI);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePairingCodeChange = (e) => {
    setPairCode(e.target.value);
  };

  const handleAmtPurchaseChange = (e) => {
    setAmtPurchase(e.target.value);
  };

  const handleAmtCashChange = (e) => {
    setAmtCash(e.target.value);
  };

  const sendPairRequest = (params) => {
    setPaired(false);
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
        console.log("SETTING SECRET");
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

        setTokenExpiry(Date.now() + response.data.expirySeconds * 1000);
        console.log("SETTING PAIRED");
        setPaired(true);
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });
  };

  const purchase = (params) => {
    const request = {
      Merchant: "00",
      TxnType: "P",
      amtPurchase,
      amtCash,
      TxnRef: "1234567890",
      CurrencyCode: "AUD",
      CutReceipt: "0",
      ReceiptAutoPrint: "0",
      Application: "00",
      PurchaseAnalysisData: {
        OPR: "00766|test",
        AMT: "0042000",
        PCM: "0000",
      },
      Basket: {
        id: "t39kq18134553",
        amt: 2145,
        tax: 200,
        dis: 50,
        sur: 0,
        items: [
          {
            id: "t39kq002",
            sku: "k24086723",
            qty: 2,
            amt: 2145,
            tax: 200,
            dis: 50,
            name: "XData USB Drive",
          },
        ],
      },
    };

    sendRequest(request, TXN);
  };

  const refund = () => {
    try {
      const request = {
        Merchant: "00",
        TxnType: "R",
        AmtPurchase: 100,
        TxnRef: "1234567890",
        CurrencyCode: "AUD",
        CutReceipt: "0",
        ReceiptAutoPrint: "0",
        App: "00",
        PurchaseAnalysisData: {
          RFN: txnResponse.PurchaseAnalysisData.RFN,
          OPR: "00766|test",
          AMT: "0042000",
          PCM: "0000",
        },
      };

      sendRequest(request, TXN);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const oneButton = (params) => {
    const request = {
      txnType: "P",
      amtPurchase: 100,
      txnRef: "96B32M9UNZ421MEI",
      merchant: "99",
      application: "02",
      receiptAutoPrint: "0",
    };

    sendRequest(request, TXN);
  };

  const reprintReceipt = (params) => {
    try {
      const request = {
        Merchant: "99",
        ReceiptAutoPrint: "0",
        ReprintType: "2",
      };

      sendRequest(request, REPRINT_RECEIPT);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const getTxnStatus = (params) => {
    try {
      const request = {};

      sendRequest(request, TXN_STATUS);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const sendRequest = (request, type) => {
    // Add a request interceptor
    axios.interceptors.request.use(
      (config) => {
        console.log("CONFIG :", config);
        config.headers["Authorization"] = "Bearer " + token;

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    let tempSessionId = uuidv4();

    let requestType;
    switch (type) {
      case TXN:
        requestType = "/transaction?async=false";
        break;
      case REPRINT_RECEIPT:
        requestType = "/reprintreceipt?async=false";
        break;
      case TXN_STATUS:
        requestType = "/transaction?async=false";
        tempSessionId = lastSessionId;
        break;
    }

    const uri = linklyEndpoint + tempSessionId + requestType;
    console.log("request :", request);

    if (type === TXN_STATUS) {
      return axios
        .get(uri)
        .then((response) => {
          console.log("response :", response);
          const selectedData = {
            Status: response.status,
            Message: response.statusText,
          };
          setTxnResponse(selectedData);
        })
        .catch((error) => {
          console.log("ERROR", error);
          setTxnResponse(error);
        });
    }

    setLastSessionId(tempSessionId);

    return axios
      .post(
        uri,
        { request } //, txnHeaders
      )
      .then((response) => {
        console.log("response :", response);
        setTxnResponse(response.data.response);
      })
      .catch((error) => {
        console.log("ERROR", error);
        setTxnResponse(error);
      });
  };

  let display;
  switch (displayPage) {
    case PAIRING_MENU:
      display = (
        <form>
          <div className="form-group">
            <label htmlFor="clientIdInput">Username: </label>
            <input
              className="form-control w-75"
              id="clientIdInput"
              onChange={handleUsernameChange}
              value={username}
              placeholder="Linkly Cloud Username"
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
        <div>
          <form className="row">
            <div className="form-group col">
              <label htmlFor="amtPurchaseInput">Purchase Amount: </label>
              <input
                className="form-control"
                id="amtPurchaseInput"
                onChange={handleAmtPurchaseChange}
                value={amtPurchase}
                placeholder="Amount"
              ></input>
            </div>
            <div className="form-group col">
              <label htmlFor="cashInput"> Cash: </label>
              <input
                className="form-control"
                id="cashInput"
                onChange={handleAmtCashChange}
                value={amtCash}
                placeholder="Amount"
              ></input>
            </div>
          </form>
          <br />
          <div className="form-group">
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={purchase}
            >
              Purchase
            </button>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={refund}
            >
              Refund
            </button>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={oneButton}
            >
              One Button
            </button>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={reprintReceipt}
            >
              Reprint receipt
            </button>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={getTxnStatus}
            >
              Txn Status
            </button>
          </div>
        </div>
      );
      break;
    default:
      display = <p>Please refresh page</p>;
  }

  let printResponse;
  if (txnResponse) {
    printResponse = Object.entries(txnResponse).map((field) => {
      return (
        <tr key={field[0]}>
          <th scope="row">{field[0]}: </th>
          <td>{typeof field[1] !== "object" ? field[1] : null}</td>
        </tr>
      );
    });
  }

  const POSOutput = (
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">Field</th>
          <th scope="col">Response</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Connect Status: </th>
          <td>{paired ? "Connected" : "Offline"}</td>
        </tr>
        {printResponse}
      </tbody>
    </table>
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
            <label
              className={
                "btn btn-primary " +
                (displayPage === POS_SALE_UI ? "" : "active")
              }
            >
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                onClick={handleMenuChange}
                value="pairing"
              />{" "}
              Logon
            </label>
            <label
              className={
                "btn btn-primary " +
                (displayPage === POS_SALE_UI ? "active" : "")
              }
            >
              <input
                type="radio"
                name="options"
                id="option2"
                autoComplete="off"
                onClick={handleMenuChange}
                value="sale"
              />{" "}
              Transaction
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
