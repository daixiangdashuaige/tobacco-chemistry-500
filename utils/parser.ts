import { Question } from '../types';

export const parseQuestions = (rawData: string): Question[] => {
  const questions: Question[] = [];
  // Normalize newlines
  const lines = rawData.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  let currentQ: Partial<Question> = {};
  let currentOptions: any = {};
  
  // Updated regex to be more permissive with punctuation (., 、, :)
  const idRegex = /^(\d+)[.、]\s*(.+)/;
  const optionRegex = /^([A-D])[.、]\s*(.+)/;
  const answerRegex = /^答案[:：]\s*([A-D])/;
  const explainRegex = /^解析[:：]\s*(.+)/;

  lines.forEach((line) => {
    // 1. Check for New Question Start
    const idMatch = line.match(idRegex);
    if (idMatch) {
      // Save previous question if exists
      if (currentQ.id && currentQ.text && currentOptions.A && currentQ.correctAnswer) {
        currentQ.options = currentOptions;
        questions.push(currentQ as Question);
      }
      
      // Reset
      currentQ = {
        id: parseInt(idMatch[1]),
        text: idMatch[2],
        explanation: "暂无解析" // Default
      };
      currentOptions = {};
      return;
    }

    // 2. Check for Answer
    const ansMatch = line.match(answerRegex);
    if (ansMatch) {
      currentQ.correctAnswer = ansMatch[1] as 'A'|'B'|'C'|'D';
      return;
    }

    // 3. Check for Explanation
    const expMatch = line.match(explainRegex);
    if (expMatch) {
      currentQ.explanation = expMatch[1];
      return;
    }

    // 4. Check for Options
    const optMatch = line.match(optionRegex);
    if (optMatch) {
      currentOptions[optMatch[1]] = optMatch[2];
      return;
    }
  });

  // Push the last one
  if (currentQ.id && currentQ.text && currentOptions.A && currentQ.correctAnswer) {
    currentQ.options = currentOptions;
    questions.push(currentQ as Question);
  }

  return questions;
};

// Durstenfeld shuffle
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};