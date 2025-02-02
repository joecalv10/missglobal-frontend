"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AddWildcardProps {
  winners: any; // Replace SomeType with the actual type of contestents
}

export function ContestantsTable({winners}:AddWildcardProps) {
  return (
    <div className="bg-black border-white border rounded-[10px]">
      <Table className="  ">
        <TableHeader>
        <TableRow className="hover:bg-[#22222274] !border-b-0 text-[#222222] ">
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead className="min-w-[170px]">Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Height</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {winners.map((model:{
            name: string;
            country: string;
            age: number;
            height: string;
            _id: string;
            pic:string;
            score:number
          }, index:number) => (
            <TableRow key={index} className="hover:bg-[#22222274]">
              <TableCell className="font-medium">{index+1}</TableCell>
              <TableCell className="flex gap-1 md:gap-2 items-center">
                <div className="modelImg relative !w-[24px] h-[24px] rounded-[50%] overflow-hidden inline-block align-middle">
                  <img src={process.env.NEXT_PUBLIC_IMAGE_URL  + model.pic} className="modelImg relative !w-[24px] h-[24px] rounded-[50%] overflow-hidden inline-block align-middle" alt={model.name} />
                </div>
                {model.name}
              </TableCell>
              <TableCell>{model.country}</TableCell>
              <TableCell>{model.age}</TableCell>
              <TableCell>{model.height}</TableCell>
              <TableCell>{model.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
