"use client";
import { useEffect, useState } from "react";
// import { LuX, LuTrash2, LuFolderGit2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, useSession } from "../../lib/auth-client";
// import { LuX } from "react-icons/lu";
import { LuX, LuTrash2, LuFolderGit2 } from "react-icons/lu";

export default function MyTutorsPage() {
  const { data: session, isPending } = useSession();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    tutorName: "",
    photoURL: "",
    subject: "",
    availableDaysAndTime: "",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    institution: "",
    experience: "",
    location: "",
    teachingMode: "",
  });

  const fetchMyTutors = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/my-tutors`, {
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTutors(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyTutors();
    }
  }, [session]);

  const triggerDeleteModal = (id) => {
    setSelectedTutorId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTutor = async () => {
    if (!selectedTutorId) return;
    setDeleteLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/tutors/${selectedTutorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      });

      if (res.ok) {
        toast.success("Tutor profile deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedTutorId(null);
        fetchMyTutors();
      }
    } catch (error) {
      toast.error("Failed to delete tutor");
    } finally {
      setDeleteLoading(false);
    }
  };

  const triggerEditModal = (tutor) => {
    
    setEditFormData({
      _id: tutor._id,
      tutorName: tutor.name || "",
      photo: tutor.photo || "",
      subject: tutor.subject || "Mathematics",
      availableSlots: tutor.availableSlots || "",
      hourlyFee: tutor.hourlyFee || "",
      totalSlot: tutor.totalSlot || "",
      sessionStartDate: tutor.sessionStartDate || "",
      institution: tutor.institution || "",
      experience: tutor.experience || "",
      location: tutor.location || "",
      teachingMode: tutor.teachingMode || "Online",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/tutors/${editFormData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        toast.success("Tutor profile updated successfully!");
        setIsEditModalOpen(false);
        fetchMyTutors();
      }
    } catch (error) {
      toast.error("Failed to update tutor");
    } finally {
      setEditLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
          Loading Your Tutors...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">Please log in to view your tutors.</h2>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-base-content mb-6">My Tutors</h1>

        {tutors.length === 0 ? (
          <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-300/60">
            <p className="text-base-content/60 font-medium">You haven't added any tutors yet.</p>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/60 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-base-200/50 text-base-content/70 border-b border-base-300/60">
                    <th className="py-4 px-6 font-bold">Tutor Name</th>
                    <th className="py-4 px-6 font-bold">Subject</th>
                    <th className="py-4 px-6 font-bold">Available</th>
                    <th className="py-4 px-6 font-bold">Hourly Fee</th>
                    <th className="py-4 px-6 font-bold">Total Slot</th>
                    <th className="py-4 px-6 font-bold">Registration Date</th>
                    <th className="py-4 px-6 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tutor) => (
                    <tr key={tutor._id} className="hover:bg-base-200/20 border-b border-base-200 last:border-none transition-colors">
                      <td className="py-4 px-6 font-medium text-base-content">{tutor.name}</td>
                      <td className="py-4 px-6 text-base-content/80">{tutor.subject}</td>
                      <td className="py-4 px-6 text-base-content/60">{tutor.availableDaysAndTime}</td>
                      <td className="py-4 px-6 font-medium text-base-content">৳{tutor.hourlyFee}</td>
                      <td className="py-4 px-6">
                        <span className="badge bg-success/10 text-success border-none font-semibold text-xs rounded px-2.5 py-1">
                          {tutor.totalSlot}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-base-content/60">
                        {tutor.sessionStartDate ? new Date(tutor.sessionStartDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => triggerDeleteModal(tutor._id)}
                            className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 border border-base-200 shadow-sm"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => triggerEditModal(tutor)}
                            className="btn btn-sm btn-circle btn-ghost text-success hover:bg-success/10 border border-base-200 shadow-sm"
                          >
                            <LuFolderGit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border border-base-200 text-center">
            <button
              onClick={() => { setIsDeleteModalOpen(false); setSelectedTutorId(null); }}
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>
            <div className="mt-4">
              <h3 className="font-black text-xl text-base-content mb-2">Delete Tutor?</h3>
              <p className="text-sm text-base-content/60 px-2">
                Are you sure you want to delete this tutor entry? This cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setSelectedTutorId(null); }}
                className="btn btn-outline border-base-300"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTutor}
                className="btn btn-error text-white"
                disabled={deleteLoading}
              >
                {deleteLoading ? <span className="loading loading-spinner loading-sm"></span> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-base-100 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl border border-base-200 my-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>
            <h3 className="font-black text-xl text-base-content mb-6 text-center">Update Tutor Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Tutor Name</span></label>
                  <input
                    type="text"
                    value={editFormData.tutorName}
                    onChange={(e) => setEditFormData({ ...editFormData, tutorName: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Photo URL</span></label>
                  <input
                    type="url"
                    value={editFormData.photo}
                    onChange={(e) => setEditFormData({ ...editFormData, photo: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Subject / Category</span></label>
                  <select
                    value={editFormData.subject}
                    onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Available Days & Time</span></label>
                  <input
                    type="text"
                    value={editFormData.availableSlots}
                    onChange={(e) => setEditFormData({ ...editFormData, availableSlots: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="e.g. Sun - Thu 5:00 PM - 8:00 PM"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Hourly Fee (৳)</span></label>
                  <input
                    type="number"
                    value={editFormData.hourlyFee}
                    onChange={(e) => setEditFormData({ ...editFormData, hourlyFee: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Total Slot</span></label>
                  <input
                    type="number"
                    value={editFormData.totalSlot}
                    onChange={(e) => setEditFormData({ ...editFormData, totalSlot: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Session Start Date</span></label>
                  <input
                    type="date"
                    value={editFormData.sessionStartDate ? editFormData.sessionStartDate.split("T")[0] : ""}
                    onChange={(e) => setEditFormData({ ...editFormData, sessionStartDate: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Teaching Mode</span></label>
                  <select
                    value={editFormData.teachingMode}
                    onChange={(e) => setEditFormData({ ...editFormData, teachingMode: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Institution</span></label>
                  <input
                    type="text"
                    value={editFormData.institution}
                    onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-bold text-xs">Experience</span></label>
                  <input
                    type="text"
                    value={editFormData.experience}
                    onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <div className="form-control mt-2">
                <label className="label py-1"><span className="label-text font-bold text-xs">Location (Area/City)</span></label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-outline"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-8"
                  disabled={editLoading}
                >
                  {editLoading ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}