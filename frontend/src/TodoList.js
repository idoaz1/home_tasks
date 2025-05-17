import React, { useState, useEffect } from "react";

export default function TodoList() {
  // State to hold all fruits from the backend
  const [fruits, setFruits] = useState([]);
  // State to track the input value for a new fruit
  const [newFruit, setNewFruit] = useState("");


  /**
   * useEffect hook to load fruit data from the backend
   * Executes only once on component mount
   */
    useEffect(() => {
    fetch("http://localhost:3005/fruits")
      .then((res) => res.json())
      .then((data) => setFruits(data))
      .catch((err) => console.error("Error loading fruits:", err));
  }, []);

/* Checkbox Handler (changes the state of fruit) */
  /**
   * Handles toggling of a fruit's completed checkbox
   * Updates both frontend state and backend
   */
const handleCheckboxChange = async (fruitId) => {
  const updatedFruits = fruits.map(f =>
    f.id === fruitId
      ? { ...f, completed: f.completed === 0 ? 1 : 0 }
      : f
  );

  setFruits(updatedFruits);

  const updatedFruit = updatedFruits.find(f => f.id === fruitId);
  console.log(`Updated fruit: ${updatedFruit.name}, completed: ${updatedFruit.completed}`);

  try {
    await fetch(`http://localhost:3005/fruits/${fruitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updatedFruit.completed })
    })
    .then(res => res.json())
    .then(data => {
      // Optionally reload the full list from backend:
      fetch("http://localhost:3005/fruits")
        .then(res => res.json())
        .then(data => setFruits(data))
        .catch(err => console.error("Failed to reload fruits list:", err));
    });
  } catch (error) {
    console.error('Failed to update checkbox state:', error);
  }
};

const addFruit = () => {
  const trimmed = newFruit.trim().toLowerCase();
  if (trimmed === "") return;

  // Check for duplicates locally
  if (fruits.some(fruit => fruit.name.toLowerCase() === trimmed)) {
    alert("This fruit already exists!");
    return;
  }

  fetch("http://localhost:3005/fruits", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newFruit, quantity: 1 }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error); });
      }
      return res.json();
    })
    .then((data) => {
      setFruits([...fruits, { id: data.id, name: newFruit }]);
      setNewFruit("");
    })
    .catch((err) => {
      alert("Error adding fruit: " + err.message);
      console.error("Error adding fruit:", err);
    });
};



  const deleteFruit = (id) => {
    fetch(`http://localhost:3005/fruits/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      
    })    
      .then((res) => res.json())
      .then(() => {
        setFruits(fruits.filter((fruit) => fruit.id !== id));
      })
      .catch((err) => console.error("Error deleting fruit:", err));
  };

// Number selection for each element (updates quantity)
const handleQuantityChange = async (fruitId, quantity) => {
  const updatedFruits = fruits.map(f =>
    f.id === fruitId
      ? { ...f, quantity }
      : f
  );

  setFruits(updatedFruits);

  const updatedFruit = updatedFruits.find(f => f.id === fruitId);
  console.log(`Updated fruit: ${updatedFruit.name}, quantity: ${updatedFruit.quantity}`);

  try {
    await fetch(`http://localhost:3005/fruits/${fruitId}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: updatedFruit.quantity })
    })
    .then(res => res.json())
    .then(data => {
      // Optionally reload the full list from backend:
      fetch("http://localhost:3005/fruits")
        .then(res => res.json())
        .then(data => setFruits(data))
        .catch(err => console.error("Failed to reload fruits list:", err));
    });
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

  return (
    <div>
      <h2>TO DO LIST ✔️:</h2>
      <ul>
        
        {fruits.map((fruit) => (
          <div key={fruit.id}>  {/* unique key per fruit */}
              <input
                type="checkbox"
                checked={fruit.completed === 1}
                onChange={() => handleCheckboxChange(fruit.id)}
                style={{ marginRight: '10px' }}
              />
              {fruit.name}
              <select
                value={fruit.quantity || 1}
                onChange={(e) => handleQuantityChange(fruit.id, parseInt(e.target.value))}
                style={{ margin: '0 10px' }}
              >
                {[...Array(10).keys()].map(n => (
                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                ))}
              </select>
              <button onClick={() => deleteFruit(fruit.id)}>Remove</button>
          </div>
        ))}
      </ul>

      <input
        value={newFruit}
        onChange={(e) => setNewFruit(e.target.value)}
        placeholder="Add a fruit"
      />
      <button onClick={addFruit}>Add Fruit</button>
    </div>
  );
}
