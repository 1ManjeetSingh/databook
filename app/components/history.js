import React, { useEffect, useState } from "react";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistoryData(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits

    return `${day}/${month}/${year}`;
  };

  // Group by clearedDateString
  const groupedHistory = historyData.reduce((acc, item) => {
    if (filter !== "all" && String(item.paid) !== filter) return acc;
    if (!acc[item.clearedDateString]) acc[item.clearedDateString] = [];
    acc[item.clearedDateString].push(item);
    return acc;
  }, {});

  //Form data and Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "bagadiya",
    diaryNumber: "",
    mobileNumber: "",
    bookingNumber: "",
    name: "",
    relativeName: "",
    relation: "son",
    amount: "",
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
      amount: "",
      paid: false,
    });
    setIsModalOpen(false);
  };

  const handleEditClick = (booking) => {
    setFormData(booking);
    setEditingBookingId(booking._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`/api/history/${editingBookingId}`, {
      method : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to update history");

    const updated = await res.json();

    fetchHistory();
    setIsModalOpen(false);
    setEditingBookingId(null);
    setFormData({
      type: "bagadiya",
      diaryNumber: "",
      mobileNumber: "",
      bookingNumber: "",
      name: "",
      relativeName: "",
      relation: "son",
      amount: "",
      paid: false,
    });
  } catch (error) {
    console.error("Error saving booking:", error);
  }
};

const handleDeleteBooking = async (id) => {
  try {
    const res = await fetch(`/api/history/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete booking");

    fetchHistory();
    handleCloseModal();
    console.log("Booking deleted successfully");
  } catch (error) {
    console.error("Error deleting booking:", error);
    alert("Something went wrong while deleting booking");
  }
};


  return (
    <div className="px-4">
      <div className="flex w-full justify-between items-center fixed top-[7vh] left-0 p-2 z-[2] bg-white">
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <div className="flex h-[8vh]"></div>

      {Object.keys(groupedHistory).length === 0 ? (
        <p className="text-red-500">No records found.</p>
      ) : (
        Object.entries(groupedHistory)
          .reverse()
          .map(([date, items]) => (
            <div key={date} className="mb-8">
              <h2 className="flex justify-center text-xl font-bold mb-2 border-b border-t mb-4">{date}</h2>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, idx) => (
                  <li
                    key={item._id}
                    className="p-4 border rounded bg-gray-50 relative w-full max-w-[330px]"
                  >
                    <p className="flex">
                      <strong className="flex min-w-[110px]">Diary No:</strong>{" "}
                      {item.diaryNumber}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">Mobile:</strong>{" "}
                      {item.mobileNumber}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">
                        Booking No:
                      </strong>{" "}
                      {item.bookingNumber}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">Name:</strong>{" "}
                      {item.name}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">
                        {item.relation === "wife" ? "W/O:" : "S/O:"}
                      </strong>{" "}
                      {item.relativeName}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">Amount:</strong> ₹
                      {item.amount}
                    </p>
                    <p className="flex">
                      <strong className="flex min-w-[110px]">Status:</strong>{" "}
                      <span
                        className={`${
                          item.paid
                            ? "text-green-600"
                            : "text-red-600 font-[600]"
                        }`}
                      >
                        {item.paid ? "Paid" : "Unpaid"}
                      </span>
                    </p>
                    <hr className="flex w-full bg-black my-1" />
                    <p className="flex justify-between items-center">
                      <span>{formatDate(item.createdAt)}</span>
                      <span>
                        <svg
                          onClick={() => handleEditClick(item)}
                          className="w-4 h-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                        </svg>
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-red-500 text-lg"
              onClick={() => handleCloseModal()}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Update Payment Status
            </h2>
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
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
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
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleFormValue}
                className="w-full border px-3 py-2 rounded"
              />
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
                <span onClick={()=>handleDeleteBooking(formData._id)} className="p-2 border rounded-sm"><svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span>
                <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Save
              </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
