import { makeRanking } from "./ranking.utils";

const players = [
  {
    _id: 1,
    name: "Player A",
    fake: true,
  },
  {
    _id: 2,
    name: "Player B",
    fake: true,
  },
  {
    _id: 3,
    name: "Player C",
    fake: true,
  },
  {
    _id: 4,
    name: "Player D",
    fake: true,
  },
  {
    _id: 5,
    name: "Player Edward",
    fake: false,
  },
  {
    _id: 6,
    name: "Player F",
    fake: true,
  },
];

const findRealPlayer = (ranking)=>{
  return ranking.find(({playerId}) => playerId === 5); 
}

test("Test Ranking", () => {
  let rankingPrevious = null;
  
  let realPlayerIndex = 0;
  rankingPrevious = makeRanking({
    players,
    rankingPrevious,
    realPlayerIndex
  });
  // console.log('====',rankingPrevious);
  expect(findRealPlayer(rankingPrevious).index).toBe(realPlayerIndex);

  realPlayerIndex = 3;
  rankingPrevious = makeRanking({
    players,
    rankingPrevious,
    realPlayerIndex
  });
  // console.log('====',rankingPrevious);
  expect(findRealPlayer(rankingPrevious).index).toBe(realPlayerIndex);
});
