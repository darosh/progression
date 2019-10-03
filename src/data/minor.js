export default {
  map: {
    1: { name: 'im', alt: '2,sus', links: [], group: 0 },
    2: { name: 'V', alt: '7,b9,b13,sus', links: [1], group: 1 },
    3: { name: 'bII/4', links: [2, 16, 12, 10], group: 1 },
    4: { name: 'ivm', alt: 'm6,m7,m9', links: [2, 1], group: 1 },
    5: { name: 'im/b3', links: [3, 14], group: 1 },
    6: { name: 'bIII+', links: [4, 1], group: 1 },
    7: { name: 'viio/2', links: [5, 15], group: 1 },
    8: { name: 'iio', links: [6], group: 1 },
    9: { name: 'ivm/1', links: [1], group: 1 },
    10: { name: 'im/5', links: [2], group: 1 },
    11: { name: 'viio/2', links: [10], group: 1 },
    12: { name: 'iio', links: [2, 27], group: 1 },
    13: { name: 'ivm/b6', alt: 'm6/b6,m7/b6', links: [11], group: 1 },
    14: { name: 'bVI', alt: '6,M7', links: [3, 12], group: 1 },
    15: { name: 'V', alt: '7,b9,b13,sus', links: [5, 13, 14], group: 1 },
    16: { name: 'im/b3', links: [12], group: 4 },
    17: { name: 'bVII', alt: '9', links: [1], group: 2 },
    18: { name: 'bVI', links: [17], group: 2 },
    19: { name: 'II', alt: '7,b9', links: [2], group: 2 },
    20: { name: 'viø', links: [19], group: 2 },
    21: { name: '#ivo7', links: [2], group: 2 },
    22: { name: 'I', alt: '7,b9', links: [4], group: 2 },
    23: { name: 'Vo7', alt: 'ø', links: [22], group: 2 },
    24: { name: 'iiio7', links: [4], group: 2 },
    25: { name: 'V', alt: '7,b9', links: [6], group: 2 },
    26: { name: 'iio7', links: [6], group: 2 },
    27: { name: 'ivm7', links: [1], group: 2 },
    28: { name: '#ivo7', links: [10], group: 2 },
    29: { name: 'bVI7', links: [10], group: 2 },
    30: { name: 'bIII', alt: '7,9,b9', links: [13], group: 2 },
    31: { name: 'bviiø', links: [30], group: 2 },
    32: { name: 'Vø', alt: 'o7', links: [13], group: 2 },
    33: { name: 'II', alt: '7,b9', links: [15], group: 2 },
    34: { name: 'viø', links: [33], group: 2 },
    35: { name: '#ivo7', links: [15], group: 2 },
    36: { name: 'V/1', links: [1], group: 1 }
  },
  joints: [
    [8, 7],
    [6, 5],
    [4, 3],
    [14, 13],
    [12, 11]
  ]
}
