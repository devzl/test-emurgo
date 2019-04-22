export default () => {
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
    function processQuestionD (input) {
      return getPermutation(input)
    }

    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        
        // Send the data back to the main thread
        postMessage(processQuestionD(e.data));
    })
}

