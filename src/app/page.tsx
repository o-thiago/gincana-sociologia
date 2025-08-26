import VoteComparison from "./components/vote-comparison";
import VoteCounter from "./components/vote-counter";

const groupA_ids = [206304, 206298, 206307, 206393, 206431];
const groupB_ids = [206299, 206309, 206433, 206302, 206330, 206413];

const GROUP_A_NAME = "Informática A";
const GROUP_B_NAME = "Informática B";

async function getVotes(
  id: number,
): Promise<{ id: number; votes: number; name: string }> {
  try {
    const response = await fetch(
      `https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=${id}`,
      { next: { revalidate: 60 } },
    );
    if (!response.ok) {
      return { id, votes: 0, name: "Não foi possível obter o nome" };
    }
    const html = await response.text();

    // Get votes
    const spanPrefix = '<span class="contabilizacao">';
    const spanSuffix = "</span>";
    const spanIndex = html.indexOf(spanPrefix);
    const votes = (() => {
      if (spanIndex === -1) return 0;
      const startIndex = spanIndex + spanPrefix.length;
      const endIndex = html.indexOf(spanSuffix, startIndex);
      if (endIndex === -1) return 0;
      const votesText = html.substring(startIndex, endIndex).replace(/\./g, "");
      const votes = parseInt(votesText, 10);
      return Number.isNaN(votes) ? 0 : votes;
    })();

    // Get name
    const namePrefix = '<div style="font-size:24px;margin-bottom:15px;">';
    const nameSuffix = "</div>";
    const nameIndex = html.indexOf(namePrefix);
    const name = (() => {
      if (nameIndex === -1) return "Não foi possível obter o nome";
      const startIndex = nameIndex + namePrefix.length;
      const endIndex = html.indexOf(nameSuffix, startIndex);
      if (endIndex === -1) return "Não foi possível obter o nome";
      return html.substring(startIndex, endIndex).trim();
    })();

    return { id, votes, name };
  } catch (error) {
    console.error(`Failed to fetch votes for ID ${id}:`, error);
    return { id, votes: 0, name: "Erro ao carregar" };
  }
}

export default async function Home() {
  const groupAVotesPromises = groupA_ids.map(getVotes);
  const groupBVotesPromises = groupB_ids.map(getVotes);

  const groupAVoteResults = await Promise.all(groupAVotesPromises);
  const groupBVoteResults = await Promise.all(groupBVotesPromises);

  const totalA = groupAVoteResults.reduce(
    (sum, result) => sum + result.votes,
    0,
  );
  const totalB = groupBVoteResults.reduce(
    (sum, result) => sum + result.votes,
    0,
  );

  const isTie = totalA === totalB;

  const winnerName = totalA > totalB ? GROUP_A_NAME : GROUP_B_NAME;
  const winnerVotes = Math.max(totalA, totalB);

  const loserName = totalA < totalB ? GROUP_A_NAME : GROUP_B_NAME;
  const loserVotes = Math.min(totalA, totalB);

  const title = isTie ? "🎉 Empate! 🎉" : `🎉 Parabéns ao ${winnerName}! 🎉`;
  const message = isTie
    ? `Ambos os grupos com ${totalA.toLocaleString("pt-BR")} votos.`
    : `Com um total de ${winnerVotes.toLocaleString("pt-BR")} votos (isso é ${winnerVotes - loserVotes} a mais que o ${loserName}).`;

  const winnerMessage = (
    <div className="my-8 text-center">
      <h2 className={`text-3xl font-bold ${!isTie ? "text-green-500" : ""}`}>
        {title}
      </h2>
      <p className="text-xl">{message}</p>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-foreground">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Apuração Gincana de Sociologia
        </h1>

        {winnerMessage}

        <VoteComparison
          totalA={totalA}
          totalB={totalB}
          nameA={GROUP_A_NAME}
          nameB={GROUP_B_NAME}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <VoteCounter title={GROUP_A_NAME} voteResults={groupAVoteResults} />
          <VoteCounter title={GROUP_B_NAME} voteResults={groupBVoteResults} />
        </div>
      </div>
    </main>
  );
}

