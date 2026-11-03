// 生成ファイル：scripts/generate-challenges.js が書き出す。手で書き換えない（logic-design 7章、D-02）。
// 生成器の版 1。各出題に、乱数の種・系統・検査結果（満点のつなぎ方・部分点のつなぎ方・期待水位）を持つ。
export const CHALLENGES = {
  "T7": [
    {
      "id": "T7-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "3",
          "SB": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 7007,
      "generator": 1
    },
    {
      "id": "T7-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 7007,
      "generator": 1
    }
  ],
  "T8": [
    {
      "id": "T8-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "3",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": null,
          "C": "1"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "2"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "2"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "AB": "3",
          "BC": "3",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB"
        ],
        "levels": {
          "A": "1",
          "B": "4",
          "C": "1"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "2",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "2",
          "B": null,
          "C": "1"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": null,
          "C": "2"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "3",
          "AC": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 8008,
      "generator": 1
    },
    {
      "id": "T8-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": null,
          "C": "1"
        }
      },
      "seed": 8008,
      "generator": 1
    }
  ],
  "T9": [
    {
      "id": "T9-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "1",
          "SB": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "4",
          "C": "2"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "AB": "3",
          "BC": "1",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "2",
          "C": "1"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "2",
          "C": "1"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "3",
          "SB": "3",
          "AC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AC,BC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "2",
          "SB": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "6",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "8",
          "B": "6",
          "C": "2"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "2",
          "C": "1"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "6",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 9009,
      "generator": 1
    },
    {
      "id": "T9-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "6",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 9009,
      "generator": 1
    }
  ],
  "T10": [
    {
      "id": "T10-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "SC": "2"
        },
        "targets": {
          "O1": "6",
          "O2": "6",
          "O3": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SB,SC"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "SC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2",
          "O3": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "1"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "3",
          "SB": "2",
          "SC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2",
          "O3": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SB,SC"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "3"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "SC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2",
          "O3": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "1"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "SC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2",
          "O3": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "1"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3",
          "O3": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,SC",
          "AB,SA,SB,SC",
          "BC,SA,SB,SC"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "3"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "SC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2",
          "O3": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "1"
        }
      },
      "seed": 10010,
      "generator": 1
    },
    {
      "id": "T10-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "2",
          "O3": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,SC",
        "perfectCount": 3,
        "partialKeys": [
          "BC,SA,SB,SC"
        ],
        "levels": {
          "A": "3",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 10010,
      "generator": 1
    }
  ],
  "T11": [
    {
      "id": "T11-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "2",
          "AB2": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SA2,SB",
          "AB,SA2,SB",
          "AB2,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "1",
          "AB2": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SA2,SB",
          "AB,SA,SA2,SB",
          "AB2,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "2",
          "AB2": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SA2,SB",
          "AB,SA,SA2,SB",
          "AB2,SA,SA2,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "2",
          "AB2": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "6",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SA2,SB",
          "AB,SA,SA2,SB",
          "AB2,SA,SA2,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "AB2": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SA2,SB",
          "AB,SA2,SB",
          "AB2,SA2,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "2",
          "AB2": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SA2,SB",
          "AB,SA2,SB",
          "AB2,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "2",
          "AB2": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SA2,SB",
          "AB,SA,SA2,SB",
          "AB2,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 11011,
      "generator": 1
    },
    {
      "id": "T11-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "AB2": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SA2,SB",
          "AB,SA2,SB",
          "AB2,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 11011,
      "generator": 1
    }
  ],
  "T12": [
    {
      "id": "T12-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "1",
          "SB": "1",
          "SC": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AC,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "4",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "2",
          "SB": "1",
          "SC": "1",
          "AC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AC,BC,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "9",
          "C": "3"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "SC": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AC,BC,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "3",
          "SB": "3",
          "SC": "3",
          "AC": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AC,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "3",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "SC": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AC,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "4",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "2",
          "SB": "3",
          "SC": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AC,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "4",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 12012,
      "generator": 1
    },
    {
      "id": "T12-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "3",
          "SC": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "6",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "2"
        }
      },
      "seed": 12012,
      "generator": 1
    }
  ],
  "T13": [
    {
      "id": "T13-1",
      "number": 1,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-2",
      "number": 2,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-3",
      "number": 3,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "5"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-4",
      "number": 4,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-5",
      "number": 5,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "6",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-6",
      "number": 6,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-7",
      "number": 7,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 1313,
      "generator": 1
    },
    {
      "id": "T13-8",
      "number": 8,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 1313,
      "generator": 1
    }
  ],
  "T14": [
    {
      "id": "T14-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "AB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB:2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB:2"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB:2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB:2"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB:3"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB:3"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB:3"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SB:3"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "AB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB:2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB:2"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 14014,
      "generator": 1
    },
    {
      "id": "T14-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "AB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB:2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB:2"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 14014,
      "generator": 1
    }
  ],
  "T15": [
    {
      "id": "T15-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "BC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB:2,AC:2,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:2,AC:2,BC,SA"
        ],
        "levels": {
          "A": "6",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "BC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB:3,AC:3,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:3,AC:3,BC,SA"
        ],
        "levels": {
          "A": "8",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "BC": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB:2,AC:2,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:2,AC:2,BC,SA"
        ],
        "levels": {
          "A": "3",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "BC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB:3,AC:3,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:3,AC:3,BC,SA"
        ],
        "levels": {
          "A": "8",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "BC": "2"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB:3,AC:3,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:3,AC:3,BC,SA"
        ],
        "levels": {
          "A": "4",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "BC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB:2,AC:2,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:2,AC:2,BC,SA"
        ],
        "levels": {
          "A": "6",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "BC": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB:3,AC:3,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:3,AC:3,BC,SA"
        ],
        "levels": {
          "A": "4",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 15015,
      "generator": 1
    },
    {
      "id": "T15-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "BC": "2"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB:2,AC:2,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB:2,AC:2,BC,SA"
        ],
        "levels": {
          "A": "3",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 15015,
      "generator": 1
    }
  ],
  "T16": [
    {
      "id": "T16-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA2": "1",
          "AB": "3",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB",
          "AB,SA:2,SA2,SB",
          "SA:2,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA2": "3",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "3",
          "AB": "3",
          "SB": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA2": "3",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "6",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB",
          "AB,SA:2,SA2,SB",
          "SA:2,SA2,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6"
        }
      },
      "seed": 16016,
      "generator": 1
    },
    {
      "id": "T16-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA2": "3",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "5"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 16016,
      "generator": 1
    }
  ],
  "T17": [
    {
      "id": "T17-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "2",
          "SC": "3"
        },
        "targets": {
          "O1": "6",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SC",
          "BC:1,SA:1,SC",
          "BC:2,SA:1,SC",
          "BC:3,SA:1,SC"
        ],
        "levels": {
          "A": "6",
          "B": null,
          "C": "3"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "AB": "1",
          "SC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SC",
          "BC:1,SA:3,SC",
          "BC:2,SA:3,SC",
          "BC:3,SA:3,SC"
        ],
        "levels": {
          "A": "3",
          "B": null,
          "C": "6"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "1",
          "SC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SC",
          "BC:1,SA:3,SC",
          "BC:2,SA:3,SC",
          "BC:3,SA:3,SC"
        ],
        "levels": {
          "A": "2",
          "B": null,
          "C": "4"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "AB": "2",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SC",
          "BC:1,SA:1,SC",
          "BC:2,SA:1,SC",
          "BC:3,SA:1,SC"
        ],
        "levels": {
          "A": "3",
          "B": null,
          "C": "2"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "2",
          "SC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:3,SC",
          "BC:1,SA:3,SC",
          "BC:2,SA:3,SC",
          "BC:3,SA:3,SC"
        ],
        "levels": {
          "A": "2",
          "B": null,
          "C": "4"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "AB": "1",
          "SC": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "5"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC:1,SA:1,SC",
          "AB,BC:2,SA:1,SC",
          "AB,BC:3,SA:1,SC",
          "AB,SA:1,SC",
          "BC:1,SA:1,SC",
          "BC:2,SA:1,SC",
          "BC:3,SA:1,SC"
        ],
        "levels": {
          "A": "5",
          "B": null,
          "C": "5"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "2",
          "SC": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA:1,SC",
          "BC:1,SA:1,SC",
          "BC:2,SA:1,SC",
          "BC:3,SA:1,SC"
        ],
        "levels": {
          "A": "4",
          "B": null,
          "C": "2"
        }
      },
      "seed": 17017,
      "generator": 1
    },
    {
      "id": "T17-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "AB": "3",
          "SC": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SC",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC:1,SA:3,SC",
          "AB,BC:2,SA:3,SC",
          "AB,BC:3,SA:3,SC",
          "AB,SA:3,SC",
          "BC:1,SA:3,SC",
          "BC:2,SA:3,SC",
          "BC:3,SA:3,SC"
        ],
        "levels": {
          "A": "2",
          "B": null,
          "C": "2"
        }
      },
      "seed": 17017,
      "generator": 1
    }
  ],
  "T18": [
    {
      "id": "T18-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:3,SB:3",
          "AB:2,SA:3,SB:3",
          "AB:3,SA:3,SB:3"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA2": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:3,SB:3",
          "AB:2,SA:3,SB:3",
          "AB:3,SA:3,SB:3"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "3"
        },
        "targets": {
          "O1": "6",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB:1",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:1,SB:1",
          "AB:2,SA:1,SB:1",
          "AB:3,SA:1,SB:1"
        ],
        "levels": {
          "A": "6",
          "B": "6"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "2"
        },
        "targets": {
          "O1": "6",
          "O2": "6"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB:1",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:1,SB:1",
          "AB:1,SA:2,SA2,SB:1",
          "AB:2,SA:1,SB:1",
          "AB:2,SA:2,SA2,SB:1",
          "AB:3,SA:1,SB:1",
          "AB:3,SA:2,SA2,SB:1",
          "SA:2,SA2,SB:1"
        ],
        "levels": {
          "A": "6",
          "B": "6"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA2": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:3,SB:3",
          "AB:2,SA:3,SB:3",
          "AB:3,SA:3,SB:3"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA2": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB:1",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:1,SB:1",
          "AB:1,SA:2,SA2,SB:1",
          "AB:2,SA:1,SB:1",
          "AB:2,SA:2,SA2,SB:1",
          "AB:3,SA:1,SB:1",
          "AB:3,SA:2,SA2,SB:1",
          "SA:2,SA2,SB:1"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA2": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:1,SB:1",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:1,SB:1",
          "AB:1,SA:2,SA2,SB:1",
          "AB:2,SA:1,SB:1",
          "AB:2,SA:2,SA2,SB:1",
          "AB:3,SA:1,SB:1",
          "AB:3,SA:2,SA2,SB:1",
          "SA:2,SA2,SB:1"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 18018,
      "generator": 1
    },
    {
      "id": "T18-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA2": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA:3,SB:3",
        "perfectCount": 2,
        "partialKeys": [
          "AB:1,SA:3,SB:3",
          "AB:2,SA:3,SB:3",
          "AB:3,SA:3,SB:3"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 18018,
      "generator": 1
    }
  ],
  "T19": [
    {
      "id": "T19-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 19019,
      "generator": 1
    },
    {
      "id": "T19-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 19019,
      "generator": 1
    }
  ],
  "T20": [
    {
      "id": "T20-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "SB": "1",
          "SB2": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB2"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "SB": "2",
          "SB2": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "SB": "2",
          "SB2": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "SB": "1",
          "SB2": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB2"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "SB": "3",
          "SB2": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB2"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "SB": "2",
          "SB2": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "SB": "3",
          "SB2": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB2",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB2"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    },
    {
      "id": "T20-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "SB": "2",
          "SB2": "3"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5"
        }
      },
      "seed": 20020,
      "generator": 1
    }
  ],
  "T21": [
    {
      "id": "T21-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": null,
          "C": "2"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "1",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": null,
          "C": "2"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "3",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": null,
          "C": "2"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "3",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "3",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AB,AC,SB",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": null,
          "C": "1"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5",
          "C": "3"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "1",
          "SB": "3",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "4"
        }
      },
      "seed": 21021,
      "generator": 1
    },
    {
      "id": "T21-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "1",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5",
          "C": "3"
        }
      },
      "seed": 21021,
      "generator": 1
    }
  ],
  "T22": [
    {
      "id": "T22-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "AC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "6",
          "C": "3"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "4",
          "C": "1"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "1",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "4",
          "C": "2"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "AC": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,BC,SB",
          "AC,BC,SB",
          "BC,SA,SB"
        ],
        "levels": {
          "A": null,
          "B": "4",
          "C": "1"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "3"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "2",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "4",
          "C": "2"
        }
      },
      "seed": 22022,
      "generator": 1
    },
    {
      "id": "T22-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "2",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": "6",
          "C": "2"
        }
      },
      "seed": 22022,
      "generator": 1
    }
  ],
  "T23": [
    {
      "id": "T23-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1",
          "O3": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SC"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "4"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "3",
          "BC": "1",
          "SB": "2",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1",
          "O3": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SC"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "4"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "3",
          "SB": "2",
          "SC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "1",
          "O3": "5"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SC"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "6"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "SC": "3"
        },
        "targets": {
          "O1": "5",
          "O2": "3",
          "O3": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5",
          "C": "3"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "1",
          "SB": "1",
          "SC": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "3",
          "O3": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5",
          "C": "3"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "3",
          "BC": "1",
          "SB": "3",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1",
          "O3": "1"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "2"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "1",
          "SB": "1",
          "SC": "1"
        },
        "targets": {
          "O1": "5",
          "O2": "3",
          "O3": "2"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": "5",
          "C": "3"
        }
      },
      "seed": 23023,
      "generator": 1
    },
    {
      "id": "T23-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "1",
          "SB": "1",
          "SC": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1",
          "O3": "3"
        }
      },
      "expected": {
        "perfectKey": "BC,SA,SC",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SC"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "4"
        }
      },
      "seed": 23023,
      "generator": 1
    }
  ],
  "T24": [
    {
      "id": "T24-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "SC": "3",
          "AC": "2"
        },
        "targets": {
          "O1": "5",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": null,
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "SC": "1",
          "AC": "2"
        },
        "targets": {
          "O1": "5",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "6",
          "B": null,
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "3",
          "SB": "1",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,SA,SB,SC"
        ],
        "levels": {
          "A": "5",
          "B": "7",
          "C": "5"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "2",
          "SB": "1",
          "SC": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,SA,SB,SC"
        ],
        "levels": {
          "A": "5",
          "B": "7",
          "C": "5"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "3",
          "SB": "2",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AB,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "3",
          "B": "4",
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB,SC",
        "perfectCount": 4,
        "partialKeys": [
          "AB,BC,SA,SB,SC"
        ],
        "levels": {
          "A": "3",
          "B": "4",
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "2",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": null,
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    },
    {
      "id": "T24-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "SC": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AC,SA",
          "AC,BC,SA",
          "AC,SA,SB"
        ],
        "levels": {
          "A": "5",
          "B": null,
          "C": "4"
        }
      },
      "seed": 24024,
      "generator": 1
    }
  ],
  "T25": [
    {
      "id": "T25-1",
      "number": 1,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "3",
          "AB": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB+,SA,SA2,SB",
          "AB+,SA2+,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-2",
      "number": 2,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-3",
      "number": 3,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-4",
      "number": 4,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-5",
      "number": 5,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "3",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB+,SA,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-6",
      "number": 6,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-7",
      "number": 7,
      "baseVersion": 2,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB+,SA,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 2525,
      "generator": 1
    },
    {
      "id": "T25-8",
      "number": 8,
      "baseVersion": 2,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB+,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 2525,
      "generator": 1
    }
  ],
  "T26": [
    {
      "id": "T26-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SAs": "1",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SAs": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SAs": "1",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SAs": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SAs": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "3",
          "SAs": "1",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SAs": "2",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 26026,
      "generator": 1
    },
    {
      "id": "T26-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SAs": "1",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 26026,
      "generator": 1
    }
  ],
  "T27": [
    {
      "id": "T27-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "SAs": "2",
          "ABs": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SAs+,SB",
          "ABs+,SA2,SAs,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SAs": "1",
          "ABs": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2,SAs",
          "ABs+,SAs+"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SAs": "3",
          "ABs": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "SAs": "3",
          "ABs": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA2,SAs,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "SAs": "2",
          "ABs": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA2,SAs,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SAs": "3",
          "ABs": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SAs": "3",
          "ABs": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    },
    {
      "id": "T27-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "SAs": "3",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA2,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA2,SAs,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 27027,
      "generator": 1
    }
  ],
  "T28": [
    {
      "id": "T28-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "AB": "1",
          "AB2": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SAs+,SB",
          "AB,SAs+,SB",
          "AB2,SAs+,SB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "1",
          "SA": "3",
          "AB": "1",
          "AB2": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SAs+,SB",
          "AB,SAs+,SB",
          "AB2,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SAs": "1",
          "SA": "2",
          "AB": "2",
          "AB2": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB2,SA,SAs+"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "2",
          "AB": "2",
          "AB2": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SAs+,SB",
          "AB,SA,SAs+,SB",
          "AB2,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "2",
          "AB": "3",
          "AB2": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SAs+,SB",
          "AB,SA,SAs+,SB",
          "AB2,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SAs": "3",
          "SA": "1",
          "AB": "2",
          "AB2": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "SAs+,SB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,AB2,SAs+,SB",
          "AB,SAs+,SB",
          "AB2,SAs+,SB"
        ],
        "levels": {
          "A": "1",
          "B": "1"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "2",
          "AB": "3",
          "AB2": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SAs+,SB",
          "AB,SA,SAs+,SB",
          "AB2,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 28028,
      "generator": 1
    },
    {
      "id": "T28-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "2",
          "AB": "3",
          "AB2": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AB2,SA,SAs+,SB",
          "AB,SA,SAs+,SB",
          "AB2,SA,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "3"
        }
      },
      "seed": 28028,
      "generator": 1
    }
  ],
  "T29": [
    {
      "id": "T29-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "3",
          "ABs": "2",
          "SA": "3",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,ABs+,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs+,SA,SAs",
          "AB,ABs+,SAs+"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "ABs": "1",
          "SA": "3",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "ABs": "2",
          "SA": "3",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,ABs+,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs+,SA,SAs"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "2",
          "ABs": "1",
          "SA": "3",
          "AB": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "ABs": "2",
          "SA": "1",
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,ABs+,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "3",
          "ABs": "1",
          "SA": "1",
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "3",
          "ABs": "2",
          "SA": "1",
          "AB": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,ABs+,SA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 29029,
      "generator": 1
    },
    {
      "id": "T29-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "3",
          "ABs": "1",
          "SA": "1",
          "AB": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs+,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,ABs,SAs+,SB",
          "AB,SAs+,SB",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 29029,
      "generator": 1
    }
  ],
  "T30": [
    {
      "id": "T30-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "1",
          "ABs": "2",
          "SA": "2",
          "SA2": "2",
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SA2,SAs+,SB",
        "perfectCount": 5,
        "partialKeys": [
          "AB,ABs,SA,SA2,SAs+,SB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "ABs": "3",
          "SA": "2",
          "SA2": "1",
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SA2,SAs+,SB",
        "perfectCount": 5,
        "partialKeys": [
          "AB,ABs,SA,SA2,SAs+,SB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "ABs": "3",
          "SA": "3",
          "SA2": "2",
          "AB": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs,SAs+,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "ABs": "2",
          "SA": "1",
          "SA2": "2",
          "AB": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SA2,SAs+,SB",
        "perfectCount": 5,
        "partialKeys": [
          "AB,ABs,SA,SA2,SAs+,SB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SAs": "3",
          "ABs": "2",
          "SA": "3",
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SA2,SAs+,SB",
        "perfectCount": 5,
        "partialKeys": [
          "AB,ABs,SA,SA2,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SAs": "1",
          "ABs": "2",
          "SA": "3",
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs,SAs+,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "ABs": "2",
          "SA": "2",
          "SA2": "3",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs,SAs+,SB"
        ],
        "levels": {
          "A": "4",
          "B": "3"
        }
      },
      "seed": 30030,
      "generator": 1
    },
    {
      "id": "T30-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "3",
          "ABs": "3",
          "SA": "2",
          "SA2": "2",
          "AB": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SAs+,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,ABs,SAs+,SB",
          "ABs+,SAs+,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 30030,
      "generator": 1
    }
  ],
  "T31": [
    {
      "id": "T31-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "ABs": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "ABs": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA2"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "ABs": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "ABs": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "4",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 31031,
      "generator": 1
    },
    {
      "id": "T31-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "1",
          "SA2": "1",
          "ABs": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 31031,
      "generator": 1
    }
  ],
  "T32": [
    {
      "id": "T32-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    },
    {
      "id": "T32-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 32032,
      "generator": 1
    }
  ],
  "T33": [
    {
      "id": "T33-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "SA": "1",
          "ABs": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs*,SAs+",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs*,SA,SAs,SB",
          "ABs+,SA,SAs,SB",
          "ABs+,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "3",
          "SA": "3",
          "ABs": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs*,SA,SAs,SB",
          "ABs*,SAs+,SB",
          "ABs+,SA,SAs,SB",
          "ABs+,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SAs": "3",
          "SA": "1",
          "ABs": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "3",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "SA": "1",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs*,SA,SAs,SB",
          "ABs*,SAs+,SB",
          "ABs+,SA,SAs,SB",
          "ABs+,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "3",
          "SA": "1",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "ABs*,SA,SAs,SB",
          "ABs+,SA,SAs,SB",
          "ABs+,SA,SB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 33033,
      "generator": 1
    },
    {
      "id": "T33-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "ABs": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 33033,
      "generator": 1
    }
  ],
  "T34": [
    {
      "id": "T34-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "2",
          "SA": "2",
          "SA2": "1",
          "ABs": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs+",
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "1",
          "SA": "2",
          "SA2": "1",
          "ABs": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs*,SAs+",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "1",
          "SA": "1",
          "SA2": "1",
          "ABs": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2,SB",
        "perfectCount": 4,
        "partialKeys": [
          "ABs*,SA,SA2,SAs,SB",
          "ABs*,SA,SAs+,SB",
          "ABs*,SA2,SAs+,SB",
          "ABs+,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "3",
          "SA": "1",
          "SA2": "1",
          "ABs": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2,SB",
        "perfectCount": 4,
        "partialKeys": [
          "ABs*,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "3",
          "SA": "3",
          "SA2": "1",
          "ABs": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "SA2": "1",
          "ABs": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2,SB",
        "perfectCount": 4,
        "partialKeys": [
          "ABs*,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SAs": "2",
          "SA": "3",
          "SA2": "1",
          "ABs": "1",
          "SB": "3"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 34034,
      "generator": 1
    },
    {
      "id": "T34-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "3",
          "SA": "3",
          "SA2": "2",
          "ABs": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA,SA2,SB",
        "perfectCount": 4,
        "partialKeys": [
          "ABs*,SA,SA2,SAs,SB",
          "ABs*,SA2,SAs+,SB",
          "ABs+,SA,SA2,SAs,SB",
          "ABs+,SA,SA2,SB"
        ],
        "levels": {
          "A": "3",
          "B": "2"
        }
      },
      "seed": 34034,
      "generator": 1
    }
  ],
  "T35": [
    {
      "id": "T35-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA:1,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA2": "1",
          "ABs": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA:1,SA2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA:1"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA2": "3",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1",
        "perfectCount": 2,
        "partialKeys": [
          "ABs+,SA:1"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "5",
        "thinness": {
          "SA2": "2",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA:2,SA2",
          "ABs+,SA:1",
          "ABs+,SA:2,SA2"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "5",
        "thinness": {
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA:1,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "4",
        "thinness": {
          "SA2": "2",
          "ABs": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1,SA2",
        "perfectCount": 3,
        "partialKeys": [
          "ABs+,SA:1,SA2"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    },
    {
      "id": "T35-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA:1",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA:2,SA2",
          "ABs+,SA:1",
          "ABs+,SA:2,SA2"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 35035,
      "generator": 1
    }
  ],
  "T36": [
    {
      "id": "T36-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "2",
          "SA": "3",
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "3",
          "SA": "3",
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "1",
          "SA": "2",
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs*,SAs+",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "3",
          "SA": "1",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "2",
          "SA": "1",
          "SA2": "2",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs*,SA2,SAs+",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "3",
          "SA": "2",
          "SA2": "1",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA2",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA2,SAs",
          "ABs+,SA2",
          "ABs+,SA2,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    },
    {
      "id": "T36-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SAs": "1",
          "SA": "1",
          "SA2": "3",
          "ABs": "2"
        },
        "targets": {
          "O1": "3",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "ABs*,SA",
        "perfectCount": 2,
        "partialKeys": [
          "ABs*,SA,SAs",
          "ABs*,SAs+",
          "ABs+,SA",
          "ABs+,SA,SAs"
        ],
        "levels": {
          "A": "3",
          "B": "1"
        }
      },
      "seed": 36036,
      "generator": 1
    }
  ],
  "T37": [
    {
      "id": "T37-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SA3": "3",
          "AB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA3,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,D1:open",
          "AB,SA2,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "SA3": "3",
          "AB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SA3,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "SA3": "1",
          "AB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA3,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "SA3": "2",
          "AB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,D1:open",
          "AB,SA3,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "SA3": "2",
          "AB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA3,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "SA3": "3",
          "AB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:open",
          "AB,SA2,SA3,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "SA3": "3",
          "AB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA3,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    },
    {
      "id": "T37-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "SA2": "3",
          "SA3": "2",
          "AB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA3,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA3,D1:open",
          "AB,SA2,SA3,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 37037,
      "generator": 1
    }
  ],
  "T38": [
    {
      "id": "T38-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "3",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SA2,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    },
    {
      "id": "T38-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 38038,
      "generator": 1
    }
  ],
  "T39": [
    {
      "id": "T39-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "2",
          "SB": "3",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SA,D1:half"
        ],
        "levels": {
          "A": "2",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "2",
          "AB": "3",
          "BC": "2",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB,D1:open",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "2",
          "C": "1"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SA,D1:half"
        ],
        "levels": {
          "A": "2",
          "B": "1",
          "C": "1"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "1",
          "AC": "2"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB,D1:open",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB,D1:open"
        ],
        "levels": {
          "A": "4",
          "B": "4",
          "C": "2"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "11",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SA,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "11",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB,D1:open",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB,D1:open"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "2"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "11",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "3",
          "SB": "3",
          "AC": "1"
        },
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SA,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "2",
          "C": "2"
        }
      },
      "seed": 39039,
      "generator": 1
    },
    {
      "id": "T39-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "7",
        "thinness": {
          "SA": "1",
          "AB": "3",
          "BC": "1",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "3",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AC,BC,SA,SB,D1:open",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,BC,SA,SB,D1:open"
        ],
        "levels": {
          "A": "3",
          "B": "3",
          "C": "2"
        }
      },
      "seed": 39039,
      "generator": 1
    }
  ],
  "T40": [
    {
      "id": "T40-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "3",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "AB": "2",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA2,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "SB": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    },
    {
      "id": "T40-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SB,D1:half",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,SB,D1:half"
        ],
        "levels": {
          "A": "4",
          "B": "4"
        }
      },
      "seed": 40040,
      "generator": 1
    }
  ],
  "T41": [
    {
      "id": "T41-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D2:open"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D1:half,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,D1:open"
        ],
        "levels": {
          "A": "2",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "AB": "3",
          "BC": "1",
          "SB": "2"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "4",
          "C": "2"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "AB": "1",
          "BC": "2",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D2:open"
        ],
        "levels": {
          "A": "2",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "BC": "3",
          "SB": "3"
        },
        "targets": {
          "O1": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,D1:half",
          "AB,BC,SA,SB,D1:half,D2:half"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "1"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D1:open",
          "AB,BC,SA,SB,D2:half"
        ],
        "levels": {
          "A": "4",
          "B": "6",
          "C": "2"
        }
      },
      "seed": 41041,
      "generator": 1
    },
    {
      "id": "T41-8",
      "number": 8,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "BC": "2",
          "SB": "1"
        },
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open",
        "perfectCount": 3,
        "partialKeys": [
          "AB,BC,SA,SB,D2:half"
        ],
        "levels": {
          "A": "2",
          "B": "6",
          "C": "2"
        }
      },
      "seed": 41041,
      "generator": 1
    }
  ],
  "T42": [
    {
      "id": "T42-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open,D2:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB,D1:open,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "3"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open,D2:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB,D1:open,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "BC": "3",
          "SB": "1",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,SB,D1:half",
        "perfectCount": 4,
        "partialKeys": [
          "AB,BC,SA,SB,D1:half,D2:half"
        ],
        "levels": {
          "A": "2",
          "B": "6",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open,D2:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB,D1:open,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "3",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,SB,D1:half",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,SA,SB,D2:half"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,SB,D1:half",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,SA,SB,D2:half",
          "BC,SA,SB,D2:half"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "BC": "2",
          "SB": "2",
          "AC": "2"
        },
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,BC,SB,D1:open,D2:half",
        "perfectCount": 3,
        "partialKeys": [
          "AB,AC,BC,SB,D1:open,D2:half"
        ],
        "levels": {
          "A": "1",
          "B": "3",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    },
    {
      "id": "T42-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "BC": "1",
          "SB": "2",
          "AC": "1"
        },
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,AC,SA,SB,D1:half",
        "perfectCount": 4,
        "partialKeys": [
          "AB,AC,SA,SB,D2:half",
          "AB,BC,SA,SB,D2:open",
          "BC,SA,SB,D2:open"
        ],
        "levels": {
          "A": "2",
          "B": "4",
          "C": "1"
        }
      },
      "seed": 42042,
      "generator": 1
    }
  ],
  "T43": [
    {
      "id": "T43-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "TA": "1",
          "TA2": "3"
        },
        "spring2": "10",
        "targets": {
          "O1": "6"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "6"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "TA": "3",
          "TA2": "1"
        },
        "spring2": "9",
        "targets": {
          "O1": "6"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA2",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "6"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "TA": "1",
          "TA2": "2"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA2",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "4"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "TA": "3",
          "TA2": "1"
        },
        "spring2": "10",
        "targets": {
          "O1": "6"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA2",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "6"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "TA": "1",
          "TA2": "2"
        },
        "spring2": "9",
        "targets": {
          "O1": "6"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA2",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "6"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "TA": "3",
          "TA2": "1"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA2",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "4"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "TA": "3",
          "TA2": "2"
        },
        "spring2": "8",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA2",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "4"
        }
      },
      "seed": 43043,
      "generator": 1
    },
    {
      "id": "T43-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "SA2": "2",
          "TA": "1",
          "TA2": "3"
        },
        "spring2": "9",
        "targets": {
          "O1": "6"
        }
      },
      "expected": {
        "perfectKey": "SA2,TA",
        "perfectCount": 2,
        "partialKeys": [
          "SA,SA2,TA2",
          "SA,TA,TA2"
        ],
        "levels": {
          "A": "6"
        }
      },
      "seed": 43043,
      "generator": 1
    }
  ],
  "T44": [
    {
      "id": "T44-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "TB": "1",
          "TA": "1"
        },
        "spring2": "4",
        "targets": {
          "O1": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TA",
          "SA,SA2,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "3",
          "TB": "1",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,TA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA",
          "SA,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-3",
      "number": 3,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "TB": "3",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,TA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA",
          "SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "3",
          "TB": "2",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TA",
          "SA,SA2,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "2",
          "TB": "2",
          "TA": "1"
        },
        "spring2": "4",
        "targets": {
          "O1": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TA",
          "SA,SA2,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "TB": "3",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "5"
        }
      },
      "expected": {
        "perfectKey": "SA,TA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA",
          "SA,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "1",
          "TB": "2",
          "TA": "2"
        },
        "spring2": "2",
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "SA,TA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA",
          "SA,TA,TB"
        ],
        "levels": {
          "A": "3",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    },
    {
      "id": "T44-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "3",
          "TB": "1",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "SA,SA2,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TA",
          "SA,SA2,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": null
        }
      },
      "seed": 44044,
      "generator": 1
    }
  ],
  "T45": [
    {
      "id": "T45-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "TB": "3",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SB,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "4"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-2",
      "number": 2,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "TB": "1",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "2",
        "targets": {
          "O1": "2",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "SA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "1"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "AB": "2",
          "TB": "3",
          "SB": "2",
          "TA": "3"
        },
        "spring2": "4",
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "SA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "TB": "1",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SB,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "4"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "AB": "1",
          "TB": "1",
          "SB": "2",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "3",
          "AB": "2",
          "TB": "2",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SB,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "4"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "3",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "2",
          "O2": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SB,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "4"
        }
      },
      "seed": 45045,
      "generator": 1
    },
    {
      "id": "T45-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "2",
          "SB": "3",
          "TA": "3"
        },
        "spring2": "6",
        "targets": {
          "O1": "6",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "SA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TB"
        ],
        "levels": {
          "A": "6",
          "B": "2"
        }
      },
      "seed": 45045,
      "generator": 1
    }
  ],
  "T46": [
    {
      "id": "T46-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "TB": "2",
          "TB2": "1"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TB2",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA2,TB,TB2"
        ],
        "levels": {
          "A": "6",
          "B": "4"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "TB": "2",
          "TB2": "1"
        },
        "spring2": "4",
        "targets": {
          "O1": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TB2",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA2,TB,TB2"
        ],
        "levels": {
          "A": "7",
          "B": "3"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "8",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "1",
          "TB": "1",
          "TB2": "2"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,TB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TB,TB2"
        ],
        "levels": {
          "A": "6",
          "B": "4"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "TB": "3",
          "TB2": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TB2",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA2,TB,TB2"
        ],
        "levels": {
          "A": "5",
          "B": "2"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "2",
          "SA2": "1",
          "AB": "2",
          "TB": "2",
          "TB2": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TB2",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "6",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "3",
          "TB": "1",
          "TB2": "3"
        },
        "spring2": "3",
        "targets": {
          "O1": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,TB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TB,TB2"
        ],
        "levels": {
          "A": "5",
          "B": "2"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-7",
      "number": 7,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "2",
          "TB": "1",
          "TB2": "2"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,TB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SA2,TB2"
        ],
        "levels": {
          "A": "8",
          "B": "4"
        }
      },
      "seed": 46046,
      "generator": 1
    },
    {
      "id": "T46-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "SA2": "1",
          "AB": "3",
          "TB": "1",
          "TB2": "3"
        },
        "spring2": "6",
        "targets": {
          "O1": "4"
        }
      },
      "expected": {
        "perfectKey": "AB,SA2,TB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TB,TB2"
        ],
        "levels": {
          "A": "10",
          "B": "4"
        }
      },
      "seed": 46046,
      "generator": 1
    }
  ],
  "T47": [
    {
      "id": "T47-1",
      "number": 1,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "2",
          "SB": "3",
          "TA": "3"
        },
        "spring2": "3",
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SB,TB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "TB": "2",
          "SB": "3",
          "TA": "2"
        },
        "spring2": "2",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "2",
          "SB": "3",
          "TA": "2"
        },
        "spring2": "3",
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SB,TB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-4",
      "number": 4,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "TB": "2",
          "SB": "1",
          "TA": "1"
        },
        "spring2": "2",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-5",
      "number": 5,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "1",
          "SB": "3",
          "TA": "1"
        },
        "spring2": "4",
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "SA,SB,TA,TB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-6",
      "number": 6,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "TB": "3",
          "SB": "1",
          "TA": "2"
        },
        "spring2": "2",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "AB": "1",
          "TB": "1",
          "SB": "3",
          "TA": "1"
        },
        "spring2": "2",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,TA",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,TA,TB"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 47047,
      "generator": 1
    },
    {
      "id": "T47-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "AB": "2",
          "TB": "2",
          "SB": "3",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "3",
          "O2": "3"
        }
      },
      "expected": {
        "perfectKey": "AB,SA,SB",
        "perfectCount": 3,
        "partialKeys": [
          "AB,SA,SB,TB"
        ],
        "levels": {
          "A": "5",
          "B": "3"
        }
      },
      "seed": 47047,
      "generator": 1
    }
  ],
  "T48": [
    {
      "id": "T48-1",
      "number": 1,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "2",
          "SA2": "2",
          "AB": "2",
          "TB": "2",
          "TB2": "1",
          "TA": "2"
        },
        "spring2": "6",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "TA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-2",
      "number": 2,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "2",
          "SA2": "3",
          "AB": "3",
          "TB": "3",
          "TB2": "1",
          "TA": "3"
        },
        "spring2": "4",
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "TA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,TA,TB"
        ],
        "levels": {
          "A": "1",
          "B": "1"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-3",
      "number": 3,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "3",
          "TB": "3",
          "TB2": "2",
          "TA": "1"
        },
        "spring2": "3",
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA",
        "perfectCount": 2,
        "partialKeys": [
          "SA,TA,TB2"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-4",
      "number": 4,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "3",
          "TB": "1",
          "TB2": "1",
          "TA": "1"
        },
        "spring2": "4",
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-5",
      "number": 5,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "3",
          "SA2": "3",
          "AB": "2",
          "TB": "2",
          "TB2": "1",
          "TA": "2"
        },
        "spring2": "6",
        "targets": {
          "O1": "2",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "TA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,TA,TB"
        ],
        "levels": {
          "A": "2",
          "B": "2"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-6",
      "number": 6,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "9",
        "thinness": {
          "SA": "1",
          "SA2": "2",
          "AB": "3",
          "TB": "2",
          "TB2": "3",
          "TA": "2"
        },
        "spring2": "4",
        "targets": {
          "O1": "4",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "AB,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TA"
        ],
        "levels": {
          "A": "4",
          "B": "1"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-7",
      "number": 7,
      "baseVersion": 1,
      "family": "B",
      "values": {
        "spring": "12",
        "thinness": {
          "SA": "1",
          "SA2": "1",
          "AB": "1",
          "TB": "1",
          "TB2": "2",
          "TA": "1"
        },
        "spring2": "2",
        "targets": {
          "O1": "1",
          "O2": "1"
        }
      },
      "expected": {
        "perfectKey": "TA,TB",
        "perfectCount": 2,
        "partialKeys": [
          "AB,TA,TB"
        ],
        "levels": {
          "A": "1",
          "B": "1"
        }
      },
      "seed": 48048,
      "generator": 1
    },
    {
      "id": "T48-8",
      "number": 8,
      "baseVersion": 1,
      "family": "A",
      "values": {
        "spring": "10",
        "thinness": {
          "SA": "1",
          "SA2": "3",
          "AB": "1",
          "TB": "1",
          "TB2": "2",
          "TA": "3"
        },
        "spring2": "2",
        "targets": {
          "O1": "4",
          "O2": "2"
        }
      },
      "expected": {
        "perfectKey": "AB,SA",
        "perfectCount": 2,
        "partialKeys": [
          "AB,SA,TB",
          "AB,SA,TB,TB2",
          "AB,SA,TB2"
        ],
        "levels": {
          "A": "4",
          "B": "2"
        }
      },
      "seed": 48048,
      "generator": 1
    }
  ]
};
