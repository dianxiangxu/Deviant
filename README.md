# Solidity Mutation

## Description

Mutant generation for Solidity.

## Setup

To install Deviant:

```npm install```

Launching Deviant:

```npm start```


## Using Deviant

1. Select the folder at the root of a project (where you use ```npm test```)

2. Select the appropriate contracts for mutation testing from the list

3. Click the select mutation operators button

4. Select and **save** the mutation operators that you wish to use
* Note: If you close the window before saving, the mutation operators will not be saved

5. Click the **Run Tests** button

6. The status text should appear, displaying current progress in the generation and running of mutants

7. Once all the mutants have been ran, the report window will appear

8. In the report window, select the file that you want to view a report for
* Note: Clicking the mutant file will display the difference between the original file and the mutant
* Note: The report is shown for each individual file, not the entire project

### Important Dependencies

* [Solparse](https://github.com/duaraghav8/solparse)

* [Solmeister](https://github.com/duaraghav8/solmeister)
	* Note: We have forked this library as its depencies are out of date. The current version that we use is located [here](https://github.com/patrickjchap/solmeister).

