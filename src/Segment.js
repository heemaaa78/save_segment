import React, { useState } from "react";
import "./segment.css";
import Select from "react-select";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";

function Segment() {
  const [isSave, setIsSave] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [dropdowns, setDropdowns] = useState([null]);
  const [segmentName, setSegmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = [
    { value: "first_Name", label: "First Name" },
    { value: "last_Name", label: "Last Name" },
    { value: "Gender", label: "Gender" },
    { value: "age", label: "Age" },
    { value: "account_name", label: "Account Name" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
  ];

  const toggleDropdown = () => {
    if (dropdowns.length < 6) {
      setDropdowns([...dropdowns, null]);
    } else {
      alert("Limitation Exceeded!");
    }
  };

  const handleSelectChange = (selectedOption, index) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index] = selectedOption;
    setDropdowns(updatedDropdowns);
  };

  const handleDelete = (index) => {
    const updatedDropdowns = dropdowns.filter((_, i) => i !== index);
    setDropdowns(updatedDropdowns);
  };

  const getAvailableOptions = (index) => {
    const selectedValues = dropdowns
      .map((dropdown) => (dropdown ? dropdown.value : null))
      .filter(Boolean);

    return options.filter(
      (option) =>
        !selectedValues.includes(option.value) ||
        dropdowns[index]?.value === option.value
    );
  };

  const handleSave = async () => {
    if (!segmentName || dropdowns.every((d) => !d)) {
      setError("Please provide a segment name and at least one schema.");
      return;
    }
    setError("");
    setLoading(true);

    const payload = {
      segmentName,
      schemas: dropdowns
        .map((dropdown) => (dropdown ? dropdown.value : null))
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://webhook.site/685cf52d-cde4-4cc1-8c1c-01f64c08caa9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      setError("Error saving segment. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`save-button ${isButtonClicked ? "hidden" : ""}`}
        onClick={() => {
          setIsSave(true);
          setIsButtonClicked(true);
        }}
      >
        Save segment
      </button>
      {isSave && (
        <div>
          <div id="name">
            <label>Enter the Name of the Segment</label>
            <input
              type="text"
              placeholder="Name of the Segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <p>
              To save your segment, you need to add the schema to build the
              query.
            </p>
            <div className="traits">
              <p>Group Traits</p>
            </div>
            <div>
              <div className="select">
                {dropdowns.map((dropdown, index) => (
                  <div className="schema" key={index}>
                    <Select
                      className="drop"
                      options={getAvailableOptions(index)}
                      placeholder="Add schema to"
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, index)
                      }
                      value={dropdown}
                    />
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                      aria-label="Delete dropdown"
                    >
                      <FontAwesomeIcon icon={faMinusSquare} />
                    </button>
                  </div>
                ))}
              </div>
              <a href="#" onClick={toggleDropdown} className="traits">
                + Add new Schema
              </a>
            </div>
            <div>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save the Segment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Segment;
