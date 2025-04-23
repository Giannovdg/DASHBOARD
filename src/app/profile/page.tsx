"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function ProfilePage() {
  const { user, loading, signOut, updateUserProfile } = useSupabaseAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");
    }
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const handleSaveProfile = async () => {
    setUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      await updateUserProfile({ 
        full_name: name 
      });
      
      setIsEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem="Profile" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {successMessage && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md">
                      {successMessage}
                    </div>
                  )}
                  
                  {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                        {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            user?.user_metadata?.full_name || user?.email || "User"
                          )}
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 pb-2">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Account Information</h3>
                        {!isEditMode ? (
                          <button
                            onClick={() => setIsEditMode(true)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setIsEditMode(false)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              disabled={updating}
                              className={`${
                                updating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                              } text-white px-3 py-1 rounded-md transition-colors`}
                            >
                              {updating ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <div className="bg-gray-50 p-2 rounded border border-gray-300">
                              {user?.user_metadata?.full_name || "Not set"}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-300">
                            {user?.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-300 truncate">
                            {user?.id}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-300">
                            {user?.created_at 
                              ? new Date(user.created_at).toLocaleDateString() 
                              : "Unknown"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Sign In</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-300">
                            {user?.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString() 
                              : "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 