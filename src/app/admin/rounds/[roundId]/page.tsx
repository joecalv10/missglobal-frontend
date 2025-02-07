"use client"; // Add this directive to make the file a Client Component

import ManageWinners from "@/components/admin/winners/ManageWinners";
import { useParams } from "next/navigation"; // Import from next/navigation
import React from "react";

export default function WinnersPage() {
  const { roundId } = useParams(); // This will give you access to dynamic params like roundId

  // Ensure that roundId is available
  if (!roundId) return <div>Loading...</div>;

  return (
    <>
      <ManageWinners roundId={roundId} /> {/* Pass roundId directly */}
    </>
  );
}
