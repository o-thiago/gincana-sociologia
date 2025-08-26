import { Progress } from "@/components/ui/progress";

interface VoteComparisonProps {
  totalA: number;
  totalB: number;
  nameA?: string;
  nameB?: string;
}

export default function VoteComparison({
  totalA,
  totalB,
  nameA = "Grupo A",
  nameB = "Grupo B",
}: VoteComparisonProps) {
  const totalVotes = totalA + totalB;
  const percentageA = totalVotes > 0 ? (totalA / totalVotes) * 100 : 0;
  const percentageB = totalVotes > 0 ? (totalB / totalVotes) * 100 : 0;

  return (
    <div className="mx-auto my-8 w-full max-w-2xl">
      <h2 className="mb-4 text-center text-2xl font-bold">Comparativo de Votos</h2>
      <div className="flex items-center gap-4">
        <div className="w-full">
          <div className="mb-1 flex justify-between">
            <span className="font-bold">{nameA}</span>
            <span>{totalA.toLocaleString("pt-BR")}</span>
          </div>
          <Progress value={percentageA} />
        </div>
        <div className="w-full">
          <div className="mb-1 flex justify-between">
            <span className="font-bold">{nameB}</span>
            <span>{totalB.toLocaleString("pt-BR")}</span>
          </div>
          <Progress value={percentageB} />
        </div>
      </div>
    </div>
  );
}
