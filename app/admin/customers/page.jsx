"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import { FiSearch, FiUserCheck, FiUserX, FiShield, FiUser } from "react-icons/fi";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/admin/customers");
      if (res.data?.customers || res.data?.data) {
        setCustomers(res.data.customers || res.data.data);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    if (customer.role === "admin") {
      alert("Administrator accounts cannot be deactivated here.");
      return;
    }

    setUpdatingId(customer._id);
    try {
      const res = await api.patch(`/admin/customers/${customer._id}/status`);
      if (res.data?.user) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === customer._id ? res.data.user : c))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update customer status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Directory
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            Registered Customers
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-skin-sand/35 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-skin-cream/20 border border-skin-sand/50 rounded-xl focus:outline-none focus:border-skin-terracotta text-skin-charcoal"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-skin-sand/35 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-skin-sand/30 bg-skin-cream/20 text-skin-charcoal/60 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skin-sand/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-skin-charcoal/50">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-skin-charcoal/40">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isActive = cust.isActive !== false;

                  return (
                    <tr key={cust._id} className="hover:bg-skin-cream/10 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-skin-sand/50 text-skin-charcoal flex items-center justify-center font-bold text-xs uppercase">
                          {cust.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-skin-charcoal">{cust.name}</p>
                          <p className="text-[10px] text-skin-charcoal/50">{cust.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cust.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-skin-cream/40 text-skin-charcoal/70"
                          }`}
                        >
                          {cust.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-skin-charcoal/60">
                        {new Date(cust.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {cust.role !== "admin" && (
                          <button
                            onClick={() => handleToggleStatus(cust)}
                            disabled={updatingId === cust._id}
                            className={`px-3 py-1 text-[11px] font-semibold rounded-xl border transition ${
                              isActive
                                ? "text-red-600 border-red-200 hover:bg-red-50"
                                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            }`}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
