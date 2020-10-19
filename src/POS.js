import React, { useState } from "react";
import "./App.css";

const PAIRING_MENU = "PAIRING_MENU";
const POS_SALE_UI = "POS_SALE_UI";

const POS = () => {
  const [displayPage, setDisplayPage] = useState(PAIRING_MENU);

  const handleSearchQuery = (params) => {};
  const handleCardChange = (e) => {
    if (e.target.value === "pairing") setDisplayPage(PAIRING_MENU);
    else if (e.target.value === "sale") setDisplayPage(POS_SALE_UI);
  };

  let display;
  switch (displayPage) {
    case PAIRING_MENU:
      display = (
        <div className="row form-group form-inline">
          <input className="form-control" onChange={handleSearchQuery}></input>
          <button type="button" className="btn btn-outline-info">
            Pair
          </button>
        </div>
      );
      break;
    case POS_SALE_UI:
      display = (
        <div className="row form-group">
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

  return (
    <div className="card-body card-div pos-card">
      <div className="row">
        <div className="col">
          <div
            className="row btn-group btn-group-toggle mb-3"
            data-toggle="buttons"
          >
            <label className="btn btn-primary active">
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                onClick={handleCardChange}
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
                onClick={handleCardChange}
                value="sale"
              />{" "}
              Sale
            </label>
          </div>
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
