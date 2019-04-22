import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Formik } from 'formik';
import * as Yup from 'yup';

import WebWorker from './webworkers/WebWorker';

import workerQC from './webworkers/app.worker.questionC.js';
import workerQD from './webworkers/app.worker.questionD.js';


class App extends Component {

  constructor() {
    super();
    this.state = {
      resultQuestionC: null,
      resultQuestionD: null
    };

    this.clearCResults = this.clearCResults.bind(this);
    this.clearDResults = this.clearDResults.bind(this);
  }


  // ****************************************** Question C ****************************************

  // --------------------------------- Clear results of question C --------------------------------

  clearCResults(e) {
    e.preventDefault();

    this.setState({
      resultQuestionC: null
    });
  }

  // ------------------------------------- Form for question C ------------------------------------

  submitArrayOfCharactersQuestionC = async ( values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
    setSubmitting(true)

    this.setState({
      resultQuestionC: null
    });

    let theWorkerInstance = new WebWorker(workerQC);

    theWorkerInstance.postMessage(values.arrayOfCharacters);

    theWorkerInstance.addEventListener('message', (event) => {
      const listOfResults = event.data;

      console.log(listOfResults)

      this.setState({
        resultQuestionC: listOfResults
      });

      setSubmitting(false)
    });
  }

  displayInputForQuestionC() {
    const questionCSchema = Yup.object().shape({
        arrayOfCharacters: Yup.string()
          .matches(/^[01\*]+$/, 'Only 0, 1, or * characters accepted.')
          .required('Required'),
    });

      return (
      <Formik

        initialValues= {{ arrayOfCharacters: ''  }}

        validationSchema={questionCSchema}

        onSubmit={async ( values, { setSubmitting, setErrors }) => {
          await this.submitArrayOfCharactersQuestionC( values, { setSubmitting, setErrors })
        }}

        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="">

            <h1 className="h3 mb-3 font-weight-normal">Please input an array of characters (string) that may be '1', '0' o '*'</h1>
            <label htmlFor="arrayOfCharacters" className="sr-only">Array of characters</label>
              <input
                type="text"
                name="arrayOfCharacters"
                className="form-control" 
                placeholder="Array of character (e.g: 10*00*0)"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.arrayOfCharacters}
              />
              
              {!(touched.arrayOfCharacters && errors.arrayOfCharacters) && (values.arrayOfCharacters.length > 20) && <div className="text-warning"><p className="small">Inputing too many stars will quickly get your computer out of memory, mind the usage of your RAM.</p></div>}
              {touched.arrayOfCharacters && errors.arrayOfCharacters && <div className="text-danger">{errors.arrayOfCharacters}</div>}

              {errors.submitError && errors.submitError.length > 0 && <div className="text-danger">{errors.submitError}</div>}

              <button type="submit" disabled={isSubmitting} className="btn btn-lg btn-primary mt-2">
                {isSubmitting ? 'Processing..' : 'Process'} 
              </button>

              <button disabled={isSubmitting} className="btn btn-lg btn-light text-muted mt-2 ml-2" onClick={this.clearCResults}>
                {isSubmitting ? 'Clear results' : 'Clear results'} 
              </button>
          </form>
        )}

        />
      );
  }

  // ------------------------------- Display results for question C -------------------------------

  displayResultQuestionC () {
    let display = []

    for (let i = 0; i < this.state.resultQuestionC.length; i++) {
      display.push(<p key={"qc" + i}>{this.state.resultQuestionC[i]}</p>)
    }

    return display
  }

  // ****************************************** Question D ****************************************

  // --------------------------------- Clear results of question D --------------------------------

  clearDResults(e) {
    e.preventDefault();

    this.setState({
      resultQuestionD: null
    });
  }

  // ------------------------------------- Form for question D ------------------------------------

  submitArraysQuestionD = async ( values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
    setSubmitting(true)
    setErrors({'submitError' : ''})

    this.setState({
      resultQuestionD: null
    });

    let theWorkerInstance = new WebWorker(workerQD);
    let input = values.arrayOfArrays

    input = input.replace(/'/g, "\"")

    try {
      let parsedInput = JSON.parse(input)

      theWorkerInstance.postMessage(parsedInput);

      theWorkerInstance.addEventListener('message', (event) => {
        const listOfResults = event.data;

      // json parse
        console.log(listOfResults)

        this.setState({
          resultQuestionD: listOfResults
        });

        setSubmitting(false)
      });
    }
    catch(err) {
      setErrors({'submitError' : 'Unable to parse the array you inputed, please input a correctly formated one.'})

      setSubmitting(false)
    }    
  }

  displayInputForQuestionD() {
    const questionCSchema = Yup.object().shape({
        arrayOfArrays: Yup.string()
          .required('Required'),
    });

      return (
      <Formik

        initialValues= {{ arrayOfArrays: ''  }}

        validationSchema={questionCSchema}

        onSubmit={ async ( values, { setSubmitting, setErrors }) => {
           await this.submitArraysQuestionD( values, { setSubmitting, setErrors })
        }}

        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="">

            <h1 className="h3 mb-3 font-weight-normal">Please input an array of arrays. e.g.; [[1,3], ['a'], [4,5]]</h1>
            <label htmlFor="arrayOfArrays" className="sr-only">Array of characters</label>
              <input
                type="text"
                name="arrayOfArrays"
                className="form-control" 
                placeholder="Array of arrays (e.g. [[1,3], ['a'], [4,5]])"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.arrayOfArrays}
              />

              {!(touched.arrayOfArrays && errors.arrayOfArrays) && (values.arrayOfArrays.length > 40) && <div className="text-warning"><p className="small">Inputing too many arrays will quickly get your computer out of memory, mind the usage of your RAM.</p></div>}              
              {touched.arrayOfArrays && errors.arrayOfArrays && <div className="text-danger">{errors.arrayOfArrays}</div>}

              {errors.submitError && errors.submitError.length > 0 && <div className="text-danger">{errors.submitError}</div>}

              <button type="submit" disabled={isSubmitting} className="btn btn-lg btn-primary mt-2">
                {isSubmitting ? 'Processing..' : 'Process'} 
              </button>

              <button disabled={isSubmitting} className="btn btn-lg btn-light text-muted mt-2 ml-2" onClick={this.clearDResults}>
                {isSubmitting ? 'Clear results' : 'Clear results'} 
              </button>
          </form>
        )}

        />
      );
  }

  // ------------------------------- Display results for question D -------------------------------

  displayResultQuestionD () {
    let display = []

    for (let i = 0; i < this.state.resultQuestionD.length; i++) {
      display.push(<p key={"qd" + i}>{this.state.resultQuestionD[i]}</p>)
    }

    return display
  }

  render() {
    return (
      <div className="App">
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-12">
                {this.displayInputForQuestionC()}

                <div className="mt-2">
                  {this.state.resultQuestionC !== null && this.state.resultQuestionC.length > 0 ? <h2>Results question C</h2> : null}
                  {this.state.resultQuestionC !== null && this.state.resultQuestionC.length > 0 ? this.displayResultQuestionC ()  : null}

                  {this.state.resultQuestionC !== null && this.state.resultQuestionC.length == 0 ? <h2 className="text-warning">There are no results for your input</h2> : null}
                </div>
                
                <hr />

                {this.displayInputForQuestionD()}

                <div className="mt-4">
                  {this.state.resultQuestionD !== null && this.state.resultQuestionD !== undefined && this.state.resultQuestionD.length > 0 ? <h2>Results question D</h2> : null}
                  {this.state.resultQuestionD !== null && this.state.resultQuestionD !== undefined && this.state.resultQuestionD.length > 0 ? this.displayResultQuestionD ()  : null}

                  {this.state.resultQuestionD !== null && this.state.resultQuestionD !== undefined && this.state.resultQuestionD.length == 0 ? <h2 className="text-warning">There are no results for your input</h2> : null}
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default App;