"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const GroceryListPage = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentDiet, setCurrentDiet] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [healthBasedSuggestions, setHealthBasedSuggestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loadingHealthData, setLoadingHealthData] = useState(true);

  useEffect(() => {
    fetchUserHealthData();
    // Load initial grocery list
    setGroceryList([
      { id: 1, name: "Apples", quantity: 5, category: "Fruits" },
      { id: 2, name: "Milk", quantity: 1, category: "Dairy" },
      { id: 3, name: "Bread", quantity: 1, category: "Bakery" },
      { id: 4, name: "Chicken Breast", quantity: 2, category: "Meat" },
    ]);
    setLoading(false);
  }, []);

  // Fetch user health data from profile
  const fetchUserHealthData = async () => {
    try {
      const response = await fetch('/api/grocery/healthSuggestions');
      const data = await response.json();
      
      if (response.ok && data.userData) {
        setUserData(data.userData);
        // Update health-based suggestions if they're provided
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setHealthBasedSuggestions(data.suggestions);
        }
      } else {
        console.error("Failed to fetch user health data:", data.message || "Unknown error");
        // Set some default suggestions for a better user experience
        setHealthBasedSuggestions([
          { name: "Spinach", reason: "Rich in iron and essential nutrients" },
          { name: "Bananas", reason: "Good source of potassium and natural energy" },
          { name: "Greek Yogurt", reason: "High in protein and probiotics" },
          { name: "Almonds", reason: "Healthy fats and protein for sustained energy" },
          { name: "Berries", reason: "High in antioxidants and vitamins" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching user health data:", error);
      // Set default suggestions here as well
      setHealthBasedSuggestions([
        { name: "Spinach", reason: "Rich in iron and essential nutrients" },
        { name: "Bananas", reason: "Good source of potassium and natural energy" },
        { name: "Greek Yogurt", reason: "High in protein and probiotics" },
        { name: "Almonds", reason: "Healthy fats and protein for sustained energy" },
        { name: "Berries", reason: "High in antioxidants and vitamins" }
      ]);
    } finally {
      setLoadingHealthData(false);
    }
  };

  const handleAddItem = (itemToAdd) => {
    let itemName = typeof itemToAdd === 'string' ? itemToAdd.trim() : 
                   (itemToAdd && typeof itemToAdd.name === 'string' ? itemToAdd.name.trim() : '');

    if (itemName) {
      const existingItem = groceryList.find(item => 
        item.name.toLowerCase() === itemName.toLowerCase()
      );

      if (!existingItem) {
        setGroceryList([
          ...groceryList,
          {
            id: Date.now(),
            name: itemName,
            quantity: 1,
            category: "Uncategorized"
          }
        ]);
        
        if (typeof itemToAdd === 'string') {
          setNewItem("");
        }
        
        // Remove from suggestions if it was added from there
        setHealthBasedSuggestions(prev => 
          prev.filter(suggestion => 
            suggestion.name.toLowerCase() !== itemName.toLowerCase()
          )
        );
      } else {
        alert(`${itemName} is already in your list.`);
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    setGroceryList(groceryList.filter((item) => item.id !== itemId));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Grocery List", 20, 10);
    autoTable(doc, {
      head: [["Name", "Quantity", "Category"]],
      body: groceryList.map(item => [item.name, item.quantity, item.category]),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10, cellPadding: 2 },
    });
    doc.save("grocery-list.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-xl">Loading your grocery list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-3xl bg-gray-800 shadow-2xl rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">
          AI Grocery List
        </h1>

        {/* Health-Based Recommendations */}
        {!loadingHealthData && healthBasedSuggestions.length > 0 && (
          <div className="mb-8 p-4 bg-blue-900/30 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3 text-blue-300">
              Personalized Health Recommendations
            </h2>
            <p className="text-sm text-blue-200 mb-3">
              Based on your health profile, we recommend adding these items:
            </p>
            <ul className="space-y-2">
              {healthBasedSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-blue-800/50 p-3 rounded-md"
                >
                  <div>
                    <span className="font-medium">{suggestion.name}</span>
                    <p className="text-xs text-blue-300 mt-1">{suggestion.reason}</p>
                  </div>
                  <button
                    onClick={() => handleAddItem(suggestion)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Item Input */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item (e.g., Eggs)"
            className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={() => handleAddItem(newItem)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Add Item
          </button>
        </div>

        {/* Grocery List */}
        {groceryList.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-300">
              Your Current List:
            </h2>
            <ul className="space-y-3">
              {groceryList.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="font-semibold text-lg">{item.name}</span>
                    <span className="text-sm text-gray-400 ml-2">
                      (Qty: {item.quantity} - {item.category})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-500 font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <button
                onClick={handleExportPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Export to PDF
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">
            Your grocery list is empty. Add some items or get AI suggestions!
          </p>
        )}
      </div>
    </div>
  );
};

export default GroceryListPage;
