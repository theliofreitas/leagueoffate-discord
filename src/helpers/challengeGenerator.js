import fs from 'fs';
import path from 'path';

export const generateChallengeCriterials = () => {
  const predefinedCriterials = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'predefinedCriterials.json'), 'utf8'));
  const criterials = [];

  predefinedCriterials.forEach(criterial => {
    const newCriterial = randomizeCriterial(criterial);

    if (newCriterial) {
      criterials.push(newCriterial);
    }
  });
  
  return criterials;
}

function randomizeCriterial(criterial) {
  let randomNumber = Math.random();

  if (randomNumber <= criterial.rate) {
    criterial.value = randomizeCriterialValue(criterial.value);
    criterial.description = generateCriterialDescription(criterial);
    
    return criterial;
  }
  
  return;
}

function randomizeCriterialValue(criterialValue) {
  if (criterialValue.type === 'ranged') {
    let randomValue = Math.floor(Math.random() * (criterialValue.max - criterialValue.min + 1) + criterialValue.min);
    
    return randomValue;
  }  
  else if (criterialValue.type === 'fixed') {
    return criterialValue.fixed;
  }  
}


function generateCriterialDescription(criterial) {
  if (criterial.field === 'participant.stats.longestTimeSpentLiving') {
    const minutes = Math.floor(criterial.value / 60);
    const seconds = criterial.value - minutes * 60;

    let sentence = `${minutes} minuto(s)`;

    if (seconds > 0) {
      sentence += ` e ${seconds} segundo(s)`
    }

    return criterial.description.replace('_VALUE_' , sentence);
  }
  
  return criterial.description.replace('_VALUE_' , criterial.value);
}