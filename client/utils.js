import React from "react";

export const decimalCleaner = num => {
  const splitVal = String(num / 100).split(".");
  while (splitVal[1] && splitVal[1].length < 2) splitVal[1] += "0";
  if (!splitVal[1]) {
    splitVal.push("00");
  }
  return splitVal[0] + "." + splitVal[1].slice(0, 2);
};

export const renderInput = function(
  name,
  type,
  placeholder,
  i,
  suggestions = []
) {
  return (
    <div key={i} className="field">
      <label className="label has-text-centered">
        <small>{placeholder}:</small>
      </label>
      <div className="control">
        <input
          className="input"
          name={name}
          type={type}
          list={suggestions.length ? "suggestions" : null}
          placeholder={placeholder}
          // onChange={() => {
          //   this.setState(prevState => ({
          //     errors: { ...prevState.errors, [name]: null }
          //   }));
          // }}
        />
        {name === "symbol" && suggestions.length ? (
          <datalist id="suggestions">
            {suggestions.map((sug, idx) => (
              <option key={idx} value={sug["1. symbol"]} />
            ))}
          </datalist>
        ) : null}
        {/* <p className="help has-text-danger">
          {this.state.errors[name] && this.state.errors[name].message}
        </p> */}
      </div>
    </div>
  );
};
