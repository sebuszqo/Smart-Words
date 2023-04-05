import React, { useEffect, useState } from "react";

import "./App.css";

interface Set {
  name: string;
  description: string;
  _id: string;
}

export function App() {
  const [placeholderText, setPlaceholderText] = useState("");
  const [searchBar, setSearchBar] = useState("");
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    const textToWrite = "SSearch for your set!";
    let index = 0;
    let textLength = textToWrite.length;
    const intervalId = setInterval(() => {
      if (index === textLength - 1) {
        clearInterval(intervalId);
      } else {
        setPlaceholderText((prevText) => prevText + textToWrite[index]);
        index++;
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function handleDeleteButtonClick(event: any) {
    (async () => {
      const response = await fetch(
        `http://localhost:3001/set/${event.target.value}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      } else {
        const updatedSets = sets.filter(
          (set) => set._id !== event.target.value
        );
        setSets(updatedSets);
      }
    })();
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://localhost:3001/set/search/${searchBar}`
      );
      const sets = await response.json();
      setSets(sets);
    })();
  }, [searchBar]);

  return (
    <div className="App">
      <header>
        <h1>SmartWords</h1>
        <div id="search-bar">
          <input
            type="text"
            value={searchBar}
            id="text-to-write"
            placeholder={placeholderText}
            onChange={(e) => setSearchBar(e.target.value)}
          />
        </div>
        <button className="add-new-set">ADD new set</button>
      </header>
      <main>
        <div className="card-container">
          {sets.map((obj) => (
            <div className="card" key={obj._id}>
              <div className="card-header">
                <h2>{obj.name}</h2>
                <button
                  value={obj._id}
                  className="delete-card-button"
                  aria-label="Delete Card"
                  type={"button"}
                  onClick={handleDeleteButtonClick}
                >
                  🗑️
                </button>
              </div>
              <div className="card-body">
                <p>{obj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
