var minDistance = function(word1, word2) {
  let grid = [[...Array(word2.length + 1).keys()]];
  for (let i = 1; i <= word1.length; i++) {
      let row = [];
      for (let j = 0; j <= word2.length; j++) {
          if (j === 0) {
              row.push(i);
          } else {
              row.push(Math.min(Math.min(grid[i-1][j], row[j-1]), grid[i-1][j-1]) 
                  + (word1[i-1] === word2[j-1] ? 0 : 1));
          }
          if (j === word2.length) grid.push(row);
      }
  }
  console.log(grid)
  return grid.pop().pop();
};

minDistance("zoologicoarchaeologist", "zoogeologist");