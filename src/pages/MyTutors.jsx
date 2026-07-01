"use client";
import { useEffect, useState } from "react";
import { LuX, LuTrash2, LuFolderGit2, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, useSession } from "../lib/auth-client";

export default function MyTutorsPage() {
  const { data: session, isPending } = useSession();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    tutorName: "",
    photoURL: "",
    subject: "Mathematics",
    availableDays: "",
    availableTime: "",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    institution: "",
    experience: "1-2 years",
    location: "",
    teachingMode: "Online",
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
      console.error("Error fetching tutors:", error);
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
    const availableDays = tutor.availableDaysAndTime?.split(" ")[0] || "";
    const availableTime = tutor.availableDaysAndTime?.split(" ").slice(1).join(" ") || "";
    
    setEditFormData({
      _id: tutor._id,
      tutorName: tutor.name || "",
      photoURL: tutor.photo || "",
      subject: tutor.subject || "Mathematics",
      availableDays: availableDays,
      availableTime: availableTime,
      hourlyFee: tutor.hourlyFee || "",
      totalSlot: tutor.totalSlot || "",
      sessionStartDate: tutor.sessionStartDate || "",
      institution: tutor.institution || "",
      experience: tutor.experience || "1-2 years",
      location: tutor.location || "",
      teachingMode: tutor.teachingMode || "Online",
    });
    setImagePreview(tutor.photo || null);
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditFormData({ ...editFormData, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const formattedData = {
        ...editFormData,
        availableDaysAndTime: `${editFormData.availableDays} ${editFormData.availableTime}`,
      };

      const res = await fetch(`${baseUrl}/api/tutors/${editFormData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        toast.success("Tutor profile updated successfully!");
        setIsEditModalOpen(false);
        setImagePreview(null);
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
    <div className="bg-gradient-to-br from-base-200/40 via-base-100 to-base-200/20 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Tutors
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              Manage your registered tutors
            </p>
          </div>
          <div className="badge badge-primary badge-lg gap-2">
            {tutors.length} {tutors.length === 1 ? "Tutor" : "Tutors"}
          </div>
        </div>

        {tutors.length === 0 ? (
          <div className="bg-base-100 rounded-2xl p-16 text-center border-2 border-dashed border-base-300/60 hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <LuFolderGit2 className="w-10 h-10 text-primary/60" />
              </div>
              <p className="text-base-content/60 font-medium text-lg">No tutors added yet</p>
              <p className="text-base-content/40 text-sm">Start by adding your first tutor</p>
            </div>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-base-200/80 to-base-100 text-base-content/70 border-b border-base-300/60">
                    <th className="py-4 px-6 font-bold">Tutor</th>
                    <th className="py-4 px-6 font-bold">Subject</th>
                    <th className="py-4 px-6 font-bold">Availability</th>
                    <th className="py-4 px-6 font-bold">Fee</th>
                    <th className="py-4 px-6 font-bold">Slots</th>
                    <th className="py-4 px-6 font-bold">Start Date</th>
                    <th className="py-4 px-6 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tutor) => (
                    <tr 
                      key={tutor._id} 
                      className="hover:bg-base-200/30 border-b border-base-200/50 last:border-none transition-all duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full ring-2 ring-primary/20">
                              <img 
                                src={tutor.photo || "https://via.placeholder.com/40"} 
                                alt={tutor.name}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <span className="font-medium text-base-content">{tutor.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge badge-ghost badge-md">{tutor.subject}</span>
                      </td>
                      <td className="py-4 px-6 text-base-content/60">
                        <span className="text-xs">{tutor.availableDaysAndTime}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-primary">৳{tutor.hourlyFee}</span>
                        <span className="text-xs text-base-content/40">/hr</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge badge-success/20 text-success border-none font-semibold text-xs px-3 py-1.5">
                          {tutor.totalSlot} slots
                        </span>
                      </td>
                      <td className="py-4 px-6 text-base-content/60 text-xs">
                        {tutor.sessionStartDate ? new Date(tutor.sessionStartDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => triggerDeleteModal(tutor._id)}
                            className="btn btn-sm btn-square btn-ghost text-error/70 hover:text-error hover:bg-error/10 transition-all"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => triggerEditModal(tutor)}
                            className="btn btn-sm btn-square btn-ghost text-primary/70 hover:text-primary hover:bg-primary/10 transition-all"
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-base-100 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border border-base-200 text-center animate-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => { setIsDeleteModalOpen(false); setSelectedTutorId(null); }}
              className="btn btn-ghost btn-sm btn-square absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>
            <div className="mt-4">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                <LuTrash2 className="w-8 h-8 text-error" />
              </div>
              <h3 className="font-bold text-xl text-base-content mb-2">Delete Tutor?</h3>
              <p className="text-sm text-base-content/60 px-2">
                Are you sure you want to delete this tutor entry? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setSelectedTutorId(null); }}
                className="btn btn-outline border-base-300 hover:bg-base-200"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTutor}
                className="btn btn-error text-white hover:bg-error/90"
                disabled={deleteLoading}
              >
                {deleteLoading ? <span className="loading loading-spinner loading-sm"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-base-100 w-full max-w-3xl rounded-2xl p-8 relative shadow-2xl border border-base-200 my-8 animate-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => { setIsEditModalOpen(false); setImagePreview(null); }}
              className="btn btn-ghost btn-sm btn-square absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LuFolderGit2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-2xl text-base-content">Update Tutor Profile</h3>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.tutorName}
                    onChange={(e) => setEditFormData({ ...editFormData, tutorName: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="Enter tutor name"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Profile Photo</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring-2 ring-primary/20">
                        <img 
                          src={imagePreview || "https://via.placeholder.com/64"} 
                          alt="Preview"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full file-input-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Subject</span>
                  </label>
                  <select
                    value={editFormData.subject}
                    onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                    className="select select-bordered w-full focus:select-primary transition-all"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                {/* Available Days */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Available Days</span>
                  </label>
                  <select
                    value={editFormData.availableDays}
                    onChange={(e) => setEditFormData({ ...editFormData, availableDays: e.target.value })}
                    className="select select-bordered w-full focus:select-primary transition-all"
                    required
                  >
                    <option value="">Select days</option>
                    <option value="Mon-Fri">Monday - Friday</option>
                    <option value="Sat-Wed">Saturday - Wednesday</option>
                    <option value="Sun-Thu">Sunday - Thursday</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>

                {/* Available Time */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Available Time</span>
                  </label>
                  <select
                    value={editFormData.availableTime}
                    onChange={(e) => setEditFormData({ ...editFormData, availableTime: e.target.value })}
                    className="select select-bordered w-full focus:select-primary transition-all"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                    <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                    <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                {/* Hourly Fee */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Hourly Fee (৳)</span>
                  </label>
                  <input
                    type="number"
                    value={editFormData.hourlyFee}
                    onChange={(e) => setEditFormData({ ...editFormData, hourlyFee: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. 500"
                    required
                  />
                </div>

                {/* Total Slot */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Total Slots</span>
                  </label>
                  <input
                    type="number"
                    value={editFormData.totalSlot}
                    onChange={(e) => setEditFormData({ ...editFormData, totalSlot: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. 10"
                    required
                  />
                </div>

                {/* Session Start Date */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={editFormData.sessionStartDate ? editFormData.sessionStartDate.split("T")[0] : ""}
                    onChange={(e) => setEditFormData({ ...editFormData, sessionStartDate: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    required
                  />
                </div>

                {/* Institution */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Institution</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.institution}
                    onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. University of Dhaka"
                    required
                  />
                </div>

                {/* Experience */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Experience</span>
                  </label>
                  <select
                    value={editFormData.experience}
                    onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                    className="select select-bordered w-full focus:select-primary transition-all"
                    required
                  >
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-3 years">2-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Location</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. Dhaka, Bangladesh"
                    required
                  />
                </div>
              </div>

              {/* Teaching Mode - Radio */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Teaching Mode</span>
                </label>
                <div className="flex gap-6 pt-1">
                  {["Online", "Offline", "Both"].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="teachingMode"
                        value={mode}
                        checked={editFormData.teachingMode === mode}
                        onChange={(e) => setEditFormData({ ...editFormData, teachingMode: e.target.value })}
                        className="radio radio-primary radio-sm"
                      />
                      <span className="text-sm font-medium text-base-content/80">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setImagePreview(null); }}
                  className="btn btn-ghost hover:bg-base-200"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
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