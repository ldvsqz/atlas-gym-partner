import fs from 'fs';

import { allExercises } from "./exercises/all-exercises.js";

const filteredExercises = allExercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('cardio'))

fs.writeFile('cardio-exercises.js', `module.exports = ${JSON.stringify(filteredExercises)};`, err => {
    if (err) throw err;
    console.log('Filtered exercises file generated successfully.');
});