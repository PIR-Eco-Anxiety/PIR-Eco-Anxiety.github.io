import { Stack, Typography, Button, Backdrop, Box } from "@mui/material";
import { useState } from "react";
import { Action } from "../models/action";
import { isMultipleChoiceQuestion, isSimpleQuestion, isOpenQuestion } from "../models/questions";

export function QuestionOverlay({action, onAnswer}: {action: Action, onAnswer: (correct: boolean) => void}) {
  const [correctAnswer, setCorrectAnswer] = useState<boolean>();

  return (
    <>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">Question Bonus !</Typography>
        <Typography>{action.bonusQuestion!.question}</Typography>
        {isMultipleChoiceQuestion(action.bonusQuestion!) && (
          <>
            {correctAnswer === undefined ? action.bonusQuestion.answers.map(answer => (
              <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                <Button variant="contained" key={answer.answer} onClick={() => setCorrectAnswer(answer.isCorrect)}>
                  {answer.answer}
                </Button>
              </Box>
            )) : (
              <>
                <Typography variant="h5">
                  {correctAnswer ? "Correct." : "Incorrect. "}
                  {!correctAnswer && "La réponse était " + action.bonusQuestion!.answers.find(answer => answer.isCorrect)!.answer}
                </Typography>
                <Button variant="contained" onClick={() => onAnswer(correctAnswer)}>Continuer</Button>
              </>
            )}
          </>
        )}
        {isSimpleQuestion(action.bonusQuestion!) && (
          <>
            <Typography variant="h5">Réponse: {action.bonusQuestion!.answer}</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => onAnswer(true)}>Réponse correcte</Button>
              <Button variant="outlined" onClick={() => onAnswer(false)}>Réponse incorrecte</Button>
            </Stack>
          </>
        )}
        {isOpenQuestion(action.bonusQuestion!) && (
          <>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => onAnswer(true)}>Réponse acceptée</Button>
              <Button variant="outlined" onClick={() => onAnswer(false)}>Réponse pas acceptée</Button>
            </Stack>
          </>
        )}
      </Stack>
    </>
  )
}

export function ActionOverlay({action, setOkClicked, onCancel}: {action: Action, setOkClicked: (b: boolean) => void, onCancel: () => void}) {
  return (
    <Stack spacing={4} alignItems="center">
      <Typography variant="h4" component="h2" textAlign="center">
        {action.name}
      </Typography>
      <Typography variant="body1">
        {action.description}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => setOkClicked(true)}>
          Continuer
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}

export function ActionPopup({action, onQuestionAnswered, onCancel}: {action: Action | undefined, onQuestionAnswered: (correct: boolean) => void, onCancel: () => void}) {
  const [okClicked, setOkClicked] = useState<boolean>(false);

  const handleQuestionAnswered = (correct: boolean) => {
    setOkClicked(false);
    onQuestionAnswered(correct);
  }

  if (action === undefined) {
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }

  return (
    <Backdrop
      open={action !== undefined}
      sx={{zIndex: 100, backgroundColor: "rgba(241, 241, 241, 0.9)", display: "flex", justifyContent: "center", alignItems: "center"}}
    >
      <Box maxWidth='sm'>
        {action !== undefined && <>
          {!okClicked ? (
            <ActionOverlay action={action} setOkClicked={setOkClicked} onCancel={onCancel}/>
          ) : (
            <QuestionOverlay action={action} onAnswer={handleQuestionAnswered}/>
          )}
        </>}
      </Box>
    </Backdrop>
  );
}