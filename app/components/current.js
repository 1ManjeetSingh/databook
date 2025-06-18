import React, { useState, useEffect } from "react";

const Current = ({
  customerData,
  setIsModalOpen,
  setFormData,
  setEditingBookingId,
  setIsEditing,
  fetchBookings,
}) => {
  const [selectedType, setSelectedType] = useState("bagadiya");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleChange = (e) => {
    setSelectedType(e.target.value);
  };

  const filteredData = selectedType
    ? customerData.filter((customer) => customer.type === selectedType)
    : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits

    return `${day}/${month}/${year}`;
  };

  const handleEditClick = (booking) => {
    setFormData(booking);
    setEditingBookingId(booking._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleClearBookings = async () => {
    if (!filteredData.length) return;

    const date = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const clearedDateString = date
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, " ");

    const dataToSend = filteredData.map((item) => ({
      ...item,
      clearedDateString,
    }));

    const idsToDelete = filteredData.map((item) => item._id);
    console.log("Deleting IDs:", idsToDelete);

    try {
      // 1. Save to history
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const resData = await res.json();

      if (!res.ok) throw new Error("Failed to save to history");

      // 2. Delete from current bookings
      const deleteRes = await fetch("/api/bookings/delete-bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!deleteRes.ok) throw new Error("Failed to delete bookings");

      console.log("Bookings cleared and moved to history");

      // 3. Optionally refresh state
      fetchBookings();
    } catch (error) {
      console.error("Error clearing bookings:", error);
      alert("Something went wrong");
    }
  };

  return (
    <React.Fragment>
      <div className="px-4">
        <div className="flex w-full justify-between items-center fixed top-[7vh] left-0 p-2 z-[2] bg-white">
          <h1>Agency:</h1>
          <select
            id="typeSelect"
            value={selectedType}
            onChange={handleChange}
            className={`border border-gray-300 px-4 py-2 rounded ${
              selectedType === "hp"
                ? "bg-blue-900 text-white"
                : selectedType === "bagadiya"
                ? "bg-yellow-500"
                : "bg-red-600 text-white"
            }`}
          >
            <option value="bagadiya" className="bg-white text-black">
              Bagadiya
            </option>
            <option value="bharatgas" className="bg-white text-black">
              Bharat gas
            </option>
            <option value="hp" className="bg-white text-black">
              HP
            </option>
          </select>
        </div>

        <div className="flex h-[8vh]"></div>

        {filteredData.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-4 space-y-2">
            {filteredData.reverse().map((customer, idx) => (
              <li
                key={customer._id}
                className="p-4 border rounded bg-gray-50 relative w-full max-w-[330px]"
              >
                <span className="absolute top-0 right-2">{idx + 1}</span>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Diary No:</strong>{" "}
                  {customer.diaryNumber}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Mobile:</strong>{" "}
                  {customer.mobileNumber}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Booking No:</strong>{" "}
                  {customer.bookingNumber}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Name:</strong>{" "}
                  {customer.name}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">
                    {customer.relation === "wife" ? "W/O:" : "S/O:"}
                  </strong>{" "}
                  {customer.relativeName}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Amount:</strong> ₹
                  {customer.amount}
                </p>
                <p className="flex">
                  <strong className="flex min-w-[110px]">Status:</strong>{" "}
                  <span
                    className={`${
                      customer.paid
                        ? "text-green-600"
                        : "text-red-600 font-[600]"
                    }`}
                  >
                    {customer.paid ? "Paid" : "Unpaid"}
                  </span>
                </p>
                <hr className="flex w-full bg-black my-1" />
                <p className="flex justify-between items-center">
                  <span>{formatDate(customer.createdAt)}</span>
                  <span>
                    <svg
                      onClick={() => handleEditClick(customer)}
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

            <button
              onClick={()=>setIsConfirmationOpen(true)}
              className="border border-gray-500 flex w-full py-1 justify-center bg-red-600 text-white mb-6 hover:bg-red-500"
            >
              Clear
            </button>

            {isConfirmationOpen && (
              <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-3 text-red-500 text-lg"
                    onClick={() => setIsConfirmationOpen(false)}
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-semibold mb-4">Clear Bookings</h2>
                  <p className="flex w-full gap-4 pt-6">
                    <span className="flex w-1/2 py-1 justify-center border border-gray-500 bg-green-600 text-white font-[600]" onClick={handleClearBookings}>
                      Clear
                    </span>
                    <span className="flex w-1/2 py-1 justify-center border border-gray-500 bg-red-600 text-white font-[600]" onClick={()=>setIsConfirmationOpen(false)}>
                      Cancel
                    </span>
                  </p>
                </div>
              </div>
            )}
          </ul>
        ) : (
          selectedType && (
            <p className="mt-4 text-red-500">
              No Booking found for {selectedType}.
            </p>
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default Current;
