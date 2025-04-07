function extractTriangle(matrix, type) {
    const numRows = matrix.length;
    let result = Array.from({ length: numRows }, () => Array(numRows).fill(null));
    // console.log(result)
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numRows; j++) {
            if ((type === 'lower' && i > j) || (type === 'upper' && i < j)) {
                result[i][j] = matrix[i][j];
            }
        }
    }
  
    const uniqueIds=[]
        for(let i=0;i<result.length;i++){
            for(let j=0;j<result[i].length;j++){
                if(result[i][j] != null){
                    console.log(result[i][j])
                    uniqueIds.push(result[i][j])
                }
                
            }
        }
        console.log(uniqueIds)
    return result;
}

// Example usage:

const matrix=[
    [
      "00",
      "01",
      "02",
      "03"
    ],
    [
      "10",
      "11",
      "12",
      "13"
    ],
    [
      "20",
      "21",
      "22",
      "23"
    ],
    [
      "30",
      "31",
      "32",
      "33"
    ]
  ]
console.log(extractTriangle(matrix, 'lower'));
// console.log(extractTriangle(matrix, 'upper'));