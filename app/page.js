"use client";

import React, { useState, useEffect } from "react";
import Current from "@/app/components/current.js";
import History from "@/app/components/history.js";

export default function Home() {
  const [txt, setTxt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [customerData, setCustomerData] = useState([])
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);

      const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    useEffect(() => {  
    fetchBookings();
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "bagadiya",
    diaryNumber: "",
    mobileNumber: "",
    bookingNumber: "",
    name: "",
    relativeName: "",
    relation: "son",
    // amount: "",
    paid: false,
  });

  const handleFormValue = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCloseModal = () => {
    setFormData({
     type: "bagadiya",
    diaryNumber: "",
    mobileNumber: "",
    bookingNumber: "",
    name: "",
    relativeName: "",
    relation: "son",
    // amount: "",
    paid: false, 
    })
    setIsEditing(false);
    setIsModalOpen(false);
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  const method = isEditing ? "PUT" : "POST";
  const endpoint = isEditing ? `/api/bookings/${editingBookingId}` : `/api/bookings`;

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to save booking");

    const updated = await res.json();
    // Optionally update state or refetch bookings list here

    fetchBookings();
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingBookingId(null);
    setFormData({
      type: "bagadiya",
      diaryNumber: "",
      mobileNumber: "",
      bookingNumber: "",
      name: "",
      relativeName: "",
      relation: "son",
      // amount: "",
      paid: false,
    });
  } catch (error) {
    console.error("Error saving booking:", error);
  }
  };

  const handleDeleteBooking = async (id) => {
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete booking");

    fetchBookings();
    handleCloseModal();
    console.log("Booking deleted successfully");
  } catch (error) {
    console.error("Error deleting booking:", error);
    alert("Something went wrong while deleting booking");
  }
};


  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="sticky flex top-0 border-b border-black bg-white px-1 z-[5]">
        <div
          className={`flex w-1/2 justify-center border-r border-black py-2 ${
            isActive ? "font-[600] text-[#4076db]" : ""
          }`}
          onClick={() => setIsActive(true)}
        >
          Current
        </div>
        <div
          className={`flex w-1/2 justify-center border-l border-black py-2 ${
            isActive ? "" : "font-[600] text-[#4076db]"
          }`}
          onClick={() => setIsActive(false)}
        >
          History
        </div>
      </nav>

      <main className="flex flex-col min-h-screen">
        <div
          className="fixed bottom-4 right-4 rounded-full p-3 border border-black text-5xl bg-[rgba(255,255,255,0.7)] z-[5]"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </div>
        <div className="flex flex-col grow-1 h-full w-full px-1 py-2">
          {isActive ? 
          <Current 
          customerData={customerData}
          setIsModalOpen={setIsModalOpen}
          setFormData={setFormData}
          setEditingBookingId={setEditingBookingId}
          setIsEditing={setIsEditing}
          fetchBookings={fetchBookings}
          /> 
          : <History 
          setIsModalOpen={setIsModalOpen}
          setFormData={setFormData}
          setEditingBookingId={setEditingBookingId}
          setIsEditing={setIsEditing}
          />}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-red-500 text-lg"
              onClick={() => handleCloseModal()}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Booking" : "Add Booking"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                name="type"
                value={formData.type}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="bagadiya">Bagadiya</option>
                <option value="bharatgas">Bharat gas</option>
                <option value="hp">HP</option>
              </select>
              <input
                type="text"
                name="diaryNumber"
                placeholder="Diary Number"
                value={formData.diaryNumber}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="bookingNumber"
                placeholder="Booking Number"
                value={formData.bookingNumber}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"

              />
              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                name="relation"
                value={formData.relation}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="son">S/O</option>
                <option value="wife">W/O</option>
              </select>
              <input
                type="text"
                name="relativeName"
                placeholder="Relative Name"
                value={formData.relativeName}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
              />
              {/* <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
                required
              /> */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="paid"
                  checked={formData.paid}
                  onChange={handleFormValue}
                />
                Paid
              </label>
              <p className="flex gap-2 items-center">
                {isEditing && <span onClick={()=>handleDeleteBooking(formData._id)} className="p-2 border rounded-sm"><svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span>}
                <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Add
              </button>
              </p>
            </form>
          </div>
        </div>
      )}

      <footer className="py-6"></footer>
    </div>
  );
}
