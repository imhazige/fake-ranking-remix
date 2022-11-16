import _ from "lodash";

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

//can not use module-scope variables to store data
let rankingPrevious = null;

export const fakeRanking = () => {
  const realPlayerIndex = _.random(0, players.length, false);
  //this does not work in remix
  const previousRankingTemp = rankingPrevious;
  rankingPrevious = makeRanking({
    players,
    rankingPrevious,
    realPlayerIndex,
  });

  const rankedPalyers = [];

  for (let i = 0; i < players.length; i++) {
    const { playerId } = rankingPrevious.find(({ index }) => index === i);
    const player = players.find(({ _id }) => _id === playerId);
    const newData = { ...player };
    if (previousRankingTemp) {
        const { index } = previousRankingTemp.find(({ playerId : playerIdTmp }) => playerId === playerIdTmp);
        newData.change = i - index;
        console.log('ssss', playerId,i - index);
    }
    rankedPalyers.push(newData);
  }

  return rankedPalyers;
};

/**
 *
 * @param players - object with field _id and fake(if true it can be randomly ranking)
 * @param rankingPrevious previous ranking result
 * @param realPlayerIndex the realplayer's target ranking index after fake ranking
 * @param maxChange the random change of the ranking will be within this value
 * @returns array of {playerId, index}
 */
export const makeRanking = ({
  players,
  rankingPrevious,
  realPlayerIndex,
  maxChange = 2,
}) => {
  const ids = [];
  let realPlayer = null;
  players.map((p) => {
    if (p.fake) {
      ids.push({ playerId: p._id });
    } else {
      realPlayer = p;
    }
  });
  let ranking = null;
  if (rankingPrevious) {
    ranking = randomShuffle({
      preRanking: rankingPrevious,
      maxChange,
      realPlayerId: realPlayer._id,
      realPlayerIndex,
    });
  } else {
    ranking = _.shuffle(ids);
    //player's ranking
    ranking.splice(realPlayerIndex, 0, { playerId: realPlayer._id });
  }

  ranking.map((r, index) => (r.index = index));
  return ranking;
};

const randomShuffle = ({
  preRanking,
  maxChange,
  realPlayerId,
  realPlayerIndex,
}) => {
  //shuffle 1, make sure the real player ranking
  const shuffle1 = [];
  preRanking.map((r) => {
    if (r.playerId == realPlayerId) {
      return;
    }
    //clone
    const cl = _.cloneDeep(r);
    shuffle1.push(cl);
  });
  shuffle1.splice(realPlayerIndex, 0, { playerId: realPlayerId });
  shuffle1.map((r, index) => (r.index = index));

  //shuffle 2, only switch
  const shuffle2 = shuffle1.map((r, index) => null);
  shuffle2[realPlayerIndex] = { playerId: realPlayerId };
  const ranked = { [realPlayerId]: true };
  shuffle1.map((r, index) => {
    const { playerId } = r;

    // : scope
    const rindex = randomChangeIndex(index, maxChange, shuffle1.length - 1);

    if (ranked[playerId]) {
      return;
    }
    const targetSwitch = shuffle1[rindex];
    const targetSwitchPlayerId = targetSwitch.playerId;
    if (ranked[targetSwitchPlayerId]) {
      //switch target have shuffled
      ranked[playerId] = true;
      shuffle2[index] = r;
      return;
    }
    ranked[playerId] = true;
    ranked[targetSwitchPlayerId] = true;
    shuffle2[rindex] = r;
    shuffle2[index] = targetSwitch;
  });

  return shuffle2;
};

const randomChangeIndex = (index, maxChange, maxIndex) => {
  for (let i = 0; i < 10; i++) {
    const up = _.random(1) > 0 ? true : false;
    const rindex = index + _.random(maxChange) * (up ? -1 : 1);
    if (rindex >= 0 && rindex <= maxIndex) {
      if (rindex != index) {
        return rindex;
      }
    }
  }
  //no chnage
  return index;
};
