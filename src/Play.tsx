import { useState } from "react";
import GameSourceSelector from "./components/GameSourceSelector";
import { Backdrop, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Stack, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useStickyState } from "./hooks/stickyState";
import { Action, calculateScore, isGroupAction, isPersonalAction } from "./models/action";
import { Game } from "./models/game";
import defaultGame from "./defaultGame.json";
import { isMultipleChoiceQuestion, isOpenQuestion, isSimpleQuestion } from "./models/questions";
import { NullableRefSelector } from "./create/Common";
import { LocationOn, People } from "@mui/icons-material";
import Page from "./components/Page";

function ScoreCard({score}: {score: number}) {
  let photo;
  let text;
  if (score < 50) {
    photo = "https://i1.wp.com/www.middleeastmonitor.com/wp-content/uploads/2017/03/2008_1-Industrial-Zone.jpg";
    text = "Business as usual.";
  } else if (score < 100) {
    photo = "https://www.usnews.com/cmsmedia/86/34/71a79ae847a499cba726d89b962a/190522-citiesoh-stock.jpg";
    text = "C'est pas trop mal.";
  } else if (score < 150) {
    photo = "https://www.refinedglobalrecruitment.com/wp-content/uploads/sites/60/2023/05/Green-Sustainable-Building.jpeg";
    text = "La planete va plutot bien!";
  } else {
    photo = "https://ideas.ted.com/wp-content/uploads/sites/3/2017/07/featured_art_15509682524_85a6c8200d_o.jpg";
    text = "Super travail!!";
  }

  return (
    <Card sx={{
      width: "80%",
      aspectRatio: "4/3",
      ml: "auto",
      mr: "auto",
      mb: 4,
      mt: 4,
      position: "relative",
      borderRadius: 2,
      // For the gradient overlay:
      "&:after": {
        content: '""',
        display: "block",
        position: "absolute",
        width: "100%",
        height: "64%",
        bottom: 0,
        zIndex: 1,
        background: "linear-gradient(to top, #000, rgba(0,0,0,0))",
      },
    }}>
      <CardMedia
        image={photo}
        sx={{
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundPosition: "0% 70%",
          position: "absolute",
          filter: "brightness(80%)",
          zIndex: 0,
        }}
      />
      <CardContent sx={{
        zIndex: 2,
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 4,
        color: "white",
      }}>
        <Typography variant="h2" sx={{ zIndex: 2 }}>Score: {score}</Typography>
        <Typography variant="subtitle1" sx={{ zIndex: 2 }}>{text}</Typography> 
      </CardContent>
    </Card>
  );
}


function QuestionOverlay({action, onAnswer}: {action: Action, onAnswer: (correct: boolean) => void}) {
  const [correctAnswer, setCorrectAnswer] = useState<boolean>();

  return (
    <>
      <Stack spacing={2} direction="column">
        <Typography variant="h4">{action.bonusQuestion!.question}</Typography>
        {isMultipleChoiceQuestion(action.bonusQuestion!) && (
          <>
            {correctAnswer === undefined ? action.bonusQuestion.answers.map(answer => (
              <Button key={answer.answer} onClick={() => setCorrectAnswer(answer.isCorrect)}>
                {answer.answer}
              </Button>
            )) : (
              <>
                <Typography variant="h5">{correctAnswer ? "Correct" : "Incorrect"}</Typography>
                {!correctAnswer && <Typography variant="h5">Réponse: {action.bonusQuestion!.answers.find(answer => answer.isCorrect)!.answer}</Typography>}
              </>
            )}
          </>
        )}
        {isSimpleQuestion(action.bonusQuestion!) && (
          <>
            <Typography variant="h5">Réponse: {action.bonusQuestion!.answer}</Typography>
            <Button onClick={() => onAnswer(true)}>Réponse correcte</Button>
            <Button onClick={() => onAnswer(false)}>Réponse incorrecte</Button>
          </>
        )}
        {isOpenQuestion(action.bonusQuestion!) && (
          <>
            <Button onClick={() => onAnswer(true)}>Réponse acceptée</Button>
            <Button onClick={() => onAnswer(false)}>Réponse pas acceptée</Button>
          </>
        )}
      </Stack>
    </>
  )
}

function ActionOverlay({action, setOkClicked}: {action: Action, setOkClicked: (b: boolean) => void}) {
  return (
    <Stack>
      <Typography variant="body1">
        {action.description}
      </Typography>
      <Button variant="outlined" onClick={() => setOkClicked(true)}>
        Accepter
      </Button>
    </Stack>
  );
}

function ActionPopup({action, onQuestionAnswered}: {action: Action | null, onQuestionAnswered: (correct: boolean) => void}) {
  const [okClicked, setOkClicked] = useState<boolean>(false);

  const handleQuestionAnswered = (correct: boolean) => {
    setOkClicked(false);
    onQuestionAnswered(correct);
  }

  return (
    <Backdrop
      open={action !== null}
      sx={{zIndex: 100, backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", justifyContent: "center", alignItems: "center"}}
    >
      <Box maxWidth='md'>
        {action !== null && <>
          {!okClicked ? (
            <ActionOverlay action={action} setOkClicked={setOkClicked}/>
          ) : (
            <QuestionOverlay action={action} onAnswer={handleQuestionAnswered}/>
          )}
        </>}
      </Box>
    </Backdrop>
  );
}

function ActionFilters({game, setFilteredActions}: {game: Game, setFilteredActions: (actions: Action[]) => void}) {
  const [roleIdFilter, setRoleIdFilter] = useState<number | null>(null);
  const [locationIdFilter, setLocationIdFilter] = useState<number | null>(null);

  const updateFilteredActions = (roleId: number | null, locationId: number | null) => {
    const filteredActions = game.actions.filter(
      action => roleId === null
      || isPersonalAction(action) && action.roleId === roleId
      || isGroupAction(action) && action.roleIds.includes(roleId)
    ).filter(
      action => locationId === null || action.locationId === locationId
    ); 
    setFilteredActions(filteredActions);
  }


  const updateRoleFilter = (roleId: number | null) => {
    setRoleIdFilter(roleId);
    updateFilteredActions(roleId, locationIdFilter);
  }

  const updateLocationFilter = (locationId: number | null) => {
    setLocationIdFilter(locationId);
    updateFilteredActions(roleIdFilter, locationId);
  }

  return (
    <Stack direction='column' spacing={2}>
      <NullableRefSelector
        label="Filtre de role"
        refs={game.roles}
        setRef={updateRoleFilter}
        selectedRefId={roleIdFilter}
      />
      <NullableRefSelector
        label="Filtre de lieu"
        refs={game.map.locations}
        setRef={updateLocationFilter}
        selectedRefId={locationIdFilter}
      />
    </Stack>
  );
}

function ActionCard({game, action, onCompleteAction}: {game: Game, action: Action, onCompleteAction: () => void}) {
  return (
    <Card sx={{width: 400}}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h5">{action.name}</Typography>
          {isPersonalAction(action) && (
            <Stack direction='row' spacing={2} display='flex' justifyContent='center' alignItems='center'>
              <PersonIcon/>
              <Typography variant="body2">{game.roles.find(role => role.id == action.roleId)!.name}</Typography>
            </Stack>
          )}
          {isGroupAction(action) && (
            <Stack direction='row' spacing={2} display='flex' justifyContent='center' alignItems='center'>
              <People/>
              <Typography variant="body2">{action.roleIds.map(roleId => game.roles.find(role => role.id == roleId)!.name).join(", ")}</Typography>
            </Stack>
          )}
          <Stack direction='row' spacing={2} display='flex' justifyContent='center' alignItems='center'>
            <LocationOn/>
            <Typography variant="body2">{game.map.locations.find(location => location.id == action.locationId)!.name}</Typography>
          </Stack>
        </Stack>

      </CardContent>
      <CardActions>
        <Button variant='outlined' onClick={onCompleteAction}>
          Completer
        </Button>
      </CardActions>
    </Card>
  );
}

export function Play() {
  const [score, setScore] = useStickyState<number>(0, "score");
  const [game, setGame] = useState<Game>(defaultGame);
  const [filteredActions, setFilteredActions] = useState<Action[]>(game.actions);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  return (
    <Page>
      <GameSourceSelector setGame={setGame} />
      <Button onClick={() => setScore(0)}>Reset</Button>
      <Container maxWidth="md">
        <ScoreCard score={score} />
        <ActionFilters game={game} setFilteredActions={setFilteredActions} />
        <ActionPopup action={currentAction} onQuestionAnswered={(correct) => {
          setScore(score + calculateScore(currentAction!, correct));
          setCurrentAction(null);
        }} />
        <Box marginTop={4} display='flex' flexWrap="wrap" justifyContent="center" gap={2}>
          {filteredActions.map(action => (
            <ActionCard
              key={action.id}
              game={game}
              action={action}
              onCompleteAction={() => {
                action.bonusQuestion ? setCurrentAction(action) : setScore(score + action.points); 
              }}
            />
          ))}
        </Box>
      </Container>
    </Page>
  )
}