import { useState } from "react";
import { useUser } from "@/providers/user-provider"; // Assuming this provides user data

export const useOrganizationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]); // State to hold organizations
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const user = useUser(); // Fetch the current user details
  const [organizationLogo, setOrganizationLogo] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`api/organization/get-organizations?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations.");
      }
      const data = await response.json();
      setOrganizations(data.organizations); // Update the state with the latest organizations
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing");
      window.alert("User is not logged in or user ID is missing");
      return;
    }

    const requestBody = {
      organizationName: organizationName,
      createdBy: user.id,
    };

    try {
      setIsLoading(true); // Show loading
      const response = await fetch("/api/organization/save-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        window.alert("Failed to create organization.");
        throw new Error("Error creating organization");
      }

      const data = await response.json();
      console.log("Organization created:", data);
      window.alert("You have created organization successfully!");

      // Optionally update the state with the new organization
      setOrganizations((prevOrganizations) => [...prevOrganizations, data]);

      // Trigger page reload after operation
      window.location.reload();
    } catch (error) {
      console.error("Error creating organization:", error);
      window.alert("An error occurred while saving the data.");
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    handleSubmit,
    organizations, // Return the organizations state
    fetchOrganizations, // Expose the fetch function
    isLoading, // Expose loading state
    organizationLogo,
    setOrganizationLogo,
  };
};
