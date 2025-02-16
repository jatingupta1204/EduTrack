import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
  });

  // Reference to the hidden file input for avatar update
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/v1/users/getSingleUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.data);
      setUserData({
        email: data.data.email || "",
        username: data.data.username || "",
        first_name: data.data.first_name || "",
        last_name: data.data.last_name || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      const response = await fetch(`/api/v1/users/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          ...(user.role === "superadmin" && {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const response = await fetch("/api/v1/users/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      if (!response.ok) {
        throw new Error("Failed to update password.");
      }
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  // Avatar update functions
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const response = await fetch(`/api/v1/users/update-avatar/${user.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to update avatar");
        }
        const data = await response.json();
        // Assume the backend returns the new avatar URL in data.data.avatar
        setUser((prev) => (prev ? { ...prev, avatar: data.data.avatar } : prev));
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8 mb-6">
            <div onClick={handleAvatarClick} className="cursor-pointer">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatar || ""} alt={user.username} />
                <AvatarFallback>{user.avatar ? user.username[0] : <User className="w-6 h-6" />}</AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="w-full">
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" type="text" value={userData.username} onChange={handleInputChange} />
                  </div>
                  {user.role === "superadmin" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" name="first_name" type="text" value={userData.first_name} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" type="text" value={userData.last_name} onChange={handleInputChange} />
                      </div>
                    </>
                  )}
                  <div className="flex space-x-4 mt-4">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold mb-2">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-muted-foreground">Email: {user.email}</p>
                  <p className="text-muted-foreground">Username: {user.username}</p>
                  <Button className="mt-4" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}