export default () => {

    // Helper function, get number of stars in an inputed string
    function getNumberOfStars(theString) {
      return (theString.match(/\*/g) || []).length;
    }

    // Gets all permutations from an array
    function getPermutation(array, prefix) {
        prefix = prefix || '';
        if (!array.length) {
            return prefix;
        }

        var result = array[0].reduce(function (result, value) {
            return result.concat(getPermutation(array.slice(1), prefix + value));
        }, []);
        return result;
    }

    // function to resolve the question
    function processQuestionC (input) {

      // make an array out of the number of stars
      let tempArr = []

      for (var i = 0; i < getNumberOfStars(input); i++) {
        tempArr.push(['0', '1'])
      }

      // get all the permutations
      let initialResults = getPermutation(tempArr)

      var finalResults = []

      // replace the stars of our input for each permutation
      for (var i = 0; i < initialResults.length; i++) {
        let tempStr = input 
          for (var j = 0; j < initialResults[i].length; j++) {
            tempStr = tempStr.replace('*', initialResults[i][j]);
          }
        finalResults.push(tempStr)
      }
      
      return finalResults
    }

    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;

        // Send the data back to the main thread
        postMessage(processQuestionC(e.data));
    })
}

