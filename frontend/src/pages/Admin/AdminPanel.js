import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const [activeImage, setActiveImage] = useState("");
  const [adminOpen, setAdminOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    if (user?.profilePic) {
      try {
        const imageUrl = user.profilePic;
        const url = new URL(imageUrl);
        const fileId = url.searchParams.get("id");

        setActiveImage(
          fileId
            ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
            : imageUrl
        );
      } catch (error) {
        console.error("Invalid image URL:", error);
      }
    }
  }, [user]);

  // Handlers to close dropdowns when a link is clicked
  const handleAdminLinkClick = () => setAdminOpen(false);
  const handleInventoryLinkClick = () => setInventoryOpen(false);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white w-full md:max-w-60 customShadow p-4">
        <div className="flex justify-center items-center flex-col mb-4">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={activeImage}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <Link to={"dashboard"} className="text-sm">
            {user?.role}
          </Link>
        </div>

        {/* Admin Dropdown */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer px-2 py-1 hover:bg-slate-100 rounded"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <span className="font-semibold">Admin Panel</span>
            {adminOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {adminOpen && (
            <div className="ml-2 mt-1 space-y-1">
              <Link
                to={"dashboard"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleAdminLinkClick}
              >
                Admin Dashboard
              </Link>
              <Link
                to={"all-users"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleAdminLinkClick}
              >
                All Users
              </Link>
              <Link
                to={"orders"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleAdminLinkClick}
              >
                All Orders
              </Link>
              <Link
                to={"sales-Analysis"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleAdminLinkClick}
              >
                Sales Analysis
              </Link>
            </div>
          )}
        </div>

        {/* Inventory Dropdown */}
        <div className="mt-4">
          <div
            className="flex items-center justify-between cursor-pointer px-2 py-1 hover:bg-slate-100 rounded"
            onClick={() => setInventoryOpen(!inventoryOpen)}
          >
            <span className="font-semibold">Inventory</span>
            {inventoryOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {inventoryOpen && (
            <div className="ml-2 mt-1 space-y-1">
              <Link
                to={"inventory/dashboard"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleInventoryLinkClick}
              >
                Inventory Dashboard
              </Link>
              <Link
                to={"inventory/all-products"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleInventoryLinkClick}
              >
                All Products
              </Link>
              <Link
                to={"inventory/manage-stock"}
                className="block px-2 py-1 hover:bg-slate-100 rounded"
                onClick={handleInventoryLinkClick}
              >
                Manage Stock
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
