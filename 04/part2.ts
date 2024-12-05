import * as fs from "node:fs/promises";
import * as path from "node:path";

type Coordonnees = { x: number; y: number };

type GroupesCoordonnees = {
  vertical_haut: Coordonnees[];
  vertical_bas: Coordonnees[];
  horizontal_droite: Coordonnees[];
  horizontal_gauche: Coordonnees[];
  diagonale_haut_droite: Coordonnees[];
  diagonale_bas_droite: Coordonnees[];
  diagonale_haut_gauche: Coordonnees[];
  diagonale_bas_gauche: Coordonnees[];
};

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const SEARCHED_WORD = "MAS";

const parsedInput: string[] = input.split(/[\r\n]+/);

const {
  diagonale_bas_droite,
  diagonale_haut_droite,
  diagonale_bas_gauche,
  diagonale_haut_gauche,
} = getPossibleRelativeCoordinates(SEARCHED_WORD);

const possibleIndexesGroup = [
  diagonale_bas_droite,
  diagonale_haut_droite,
  diagonale_bas_gauche,
  diagonale_haut_gauche,
];

const findedWordIndexes: Array<Coordonnees[]> = [];

for (let i = 0; i < parsedInput.length; i++) {
  const line = parsedInput[i];
  for (let j = 0; j < line.length; j++) {
    const letter = line[j];
    if (letter !== SEARCHED_WORD[0]) continue;

    for (const group of possibleIndexesGroup) {
      let isGoodWord = true;
      const wordLetterIndexes: Coordonnees[] = [];
      for (const [searchedWordIndex, coordinates] of Object.entries(group)) {
        // Do not correspond to search word
        if (
          !parsedInput[i + coordinates.y] ||
          !parsedInput[i + coordinates.y][j + coordinates.x] ||
          parsedInput[i + coordinates.y][j + coordinates.x] !==
            SEARCHED_WORD[searchedWordIndex]
        ) {
          break;
        }
        wordLetterIndexes.push({ x: j + coordinates.x, y: i + coordinates.y });
      }
      if (wordLetterIndexes.length === SEARCHED_WORD.length)
        findedWordIndexes.push(wordLetterIndexes);
    }
  }
}

let crossWord = 0;

const sortedFindedWordIndexesByMiddleLetterCoordinates = [...findedWordIndexes];
sortedFindedWordIndexesByMiddleLetterCoordinates.sort((a, b) => {
  const middleLetterCoordinatesA = a[Math.floor(a.length / 2)];
  const middleLetterCoordinatesB = b[Math.floor(b.length / 2)];
  if (middleLetterCoordinatesA.x === middleLetterCoordinatesB.x) {
    return middleLetterCoordinatesA.y - middleLetterCoordinatesB.y;
  }
  return middleLetterCoordinatesA.x - middleLetterCoordinatesB.x;
});

for (
  let i = 0;
  i < sortedFindedWordIndexesByMiddleLetterCoordinates.length - 1;
  i++
) {
  const firstCoordinate = sortedFindedWordIndexesByMiddleLetterCoordinates[i];
  const middleLetterIndexFirst = Math.floor(firstCoordinate.length / 2);

  const secondCoordinate =
    sortedFindedWordIndexesByMiddleLetterCoordinates[i + 1];
  const middleLetterIndexSecond = Math.floor(secondCoordinate.length / 2);

  const middleLetterCoordinateFirst = firstCoordinate[middleLetterIndexFirst];
  const middleLetterCoordinateSecond =
    secondCoordinate[middleLetterIndexSecond];

  if (
    middleLetterCoordinateFirst.x === middleLetterCoordinateSecond.x &&
    middleLetterCoordinateFirst.y === middleLetterCoordinateSecond.y
  ) {
    crossWord++;
  }
}

console.log(crossWord);

function getPossibleRelativeCoordinates(
  searchedWord: string
): GroupesCoordonnees {
  const wordLength = searchedWord.length;

  const groupes: GroupesCoordonnees = {
    vertical_haut: [],
    vertical_bas: [],
    horizontal_droite: [],
    horizontal_gauche: [],
    diagonale_haut_droite: [],
    diagonale_bas_droite: [],
    diagonale_haut_gauche: [],
    diagonale_bas_gauche: [],
  };

  // Générer les mouvements verticaux
  for (let y = 0; y < wordLength; y++) {
    groupes.vertical_haut.push({ x: 0, y: y }); // Haut
    groupes.vertical_bas.push({ x: 0, y: -y }); // Bas
  }

  // Générer les mouvements horizontaux
  for (let x = 0; x < wordLength; x++) {
    groupes.horizontal_droite.push({ x: x, y: 0 }); // Droite
    groupes.horizontal_gauche.push({ x: -x, y: 0 }); // Gauche
  }

  // Générer les mouvements diagonaux
  for (let d = 0; d < wordLength; d++) {
    groupes.diagonale_haut_droite.push({ x: d, y: d }); // Haut droite
    groupes.diagonale_bas_droite.push({ x: d, y: -d }); // Bas droite
    groupes.diagonale_haut_gauche.push({ x: -d, y: d }); // Haut gauche
    groupes.diagonale_bas_gauche.push({ x: -d, y: -d }); // Bas gauche
  }

  return groupes;
}
