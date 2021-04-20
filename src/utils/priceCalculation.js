const rules = {
  150: {
    edabc: 250000,
    dabc: 100000,
    abc: 37000,
    bc: 3500,
    c: 750,
  },
  100: {
    dabc: 500000,
    abc: 10000,
    bc: 1000,
    c: 100,
  },
  70: {
    abc: 30000,
    bc: 2000,
    c: 100,
  },
  60: {
    abc: 28000,
    bc: 1000,
    c: 100,
  },
  50: {
    abc: 20000,
    bc: 1000,
    c: 100,
  },
  40: {
    abc: 13000,
    bc: 1000,
    c: 0,
  },
  30: {
    abc: 11000,
    bc: 1000,
    c: 0,
  },
  25: {
    abc: 10000,
    bc: 1000,
    c: 0,
  },
  35: {
    abc: 12000,
    bc: 1000,
    c: 50,
  },
  13: {
    a: 100,
    b: 100,
    c: 100,
  },
  15: {
    ac: 1000,
    ab: 1000,
    bc: 1000,
  },
};

const startCharMapping = {
  150: ["e", "d", "a", "b", "c"],
  100: ["d", "a", "b", "c"],
  70: ["a", "b", "c"],
  60: ["a", "b", "c"],
  50: ["a", "b", "c"],
  40: ["a", "b", "c"],
  35: ["a", "b", "c"],
  30: ["a", "b", "c"],
  25: ["a", "b", "c"],
  15: ["a", "b", "c"],
  13: ["a", "b", "c"],
};

function PriceCalculation(ticketNo, ticketPrice, ticketWinningNumber) {
  let rulesFollow = rules[ticketPrice];
  let lenTicketPrice = ticketNo[0].toString().length;

  //   console.log(rulesFollow);
  let value = {}; // this is the mapping of winning number
  let chalan = {};
  let price = 0;
  let startChar = startCharMapping[ticketPrice];

  ticketNo.forEach((ticket) => {
    let ticketNumberDict = {};

    for (let i = 0; i < lenTicketPrice; i++) {
      ticketNumberDict[startChar[i]] = parseInt(ticket[i]);
      value[startChar[i]] = parseInt(ticketWinningNumber[i]);
    }

    let rulesToFollow = Object.keys(rulesFollow);

    for (let i = 0; i < rulesToFollow.length; i++) {
      const rule = rulesToFollow[i];

      let flag = false;
      let ruleLength = rule.length;

      for (let i = 0; i < ruleLength; i++) {
        //   console.log(value[rule[i]] + "----" + ticketNumberDict[rule[i]]);
        if (value[rule[i]] === ticketNumberDict[rule[i]]) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }

      if (flag) {
        // console.log(rulesFollow[rule]);
        if (rulesFollow[rule].toString() in chalan) {
          chalan[rulesFollow[rule].toString()] =
            chalan[rulesFollow[rule].toString()] + 1;
        } else {
          chalan[rulesFollow[rule].toString()] = 1;
        }
        price = price + rulesFollow[rule];
        break;
      }
    }
  });
  return [price, chalan];
}

module.exports.PriceCalculation = PriceCalculation;
