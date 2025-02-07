import ManageWinners from "@/components/admin/winners/ManageWinners";
import { useRouter } from "next/router"; // Use useRouter hook for dynamic params
import React from "react";

export default function WinnersPage() {
  const router = useRouter(); // This hook will give access to dynamic params
  const { roundId } = router.query; // Access the roundId from the URL

  // You may want to check if roundId is available before rendering the component
  if (!roundId) return <div>Loading...</div>;

  return (
    <>
      <ManageWinners roundId={roundId as string} /> {/* Pass roundId as string */}
    </>
  );
}
