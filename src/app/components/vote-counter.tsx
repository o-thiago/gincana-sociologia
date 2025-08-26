import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VoteCounterProps {
  title: string;
  voteResults: { id: number; votes: number; name: string }[];
}

export default function VoteCounter({ title, voteResults }: VoteCounterProps) {
  const totalVotes = voteResults.reduce((sum, result) => sum + result.votes, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">
          {totalVotes.toLocaleString("pt-BR")}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[calc(100%-80px)]">Projeto</TableHead>
              <TableHead className="w-[80px] text-right">Votos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voteResults.map(({ id, votes, name }) => (
              <TableRow key={id}>
                <TableCell
                  className="max-w-0 truncate"
                  title={name}
                >
                  <a
                    href={`https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {name}
                  </a>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {votes.toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}