import ManageWinners from "@/components/admin/winners/ManageWinners";
import React from "react";

export default function WinnersPage({
  params,
}: {
  params: { roundId: string };
}) {
  return (
    <>
      <ManageWinners roundId={params.roundId}/>
    </>
  );
}
