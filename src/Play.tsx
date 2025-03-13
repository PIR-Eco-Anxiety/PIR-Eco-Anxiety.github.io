import { useState } from "react";
import GameSourceSelector from "./components/GameSourceSelector";
import { Backdrop, Button, Card, CardActionArea, CardContent, CardMedia, Container, Stack, Typography } from "@mui/material";
import { useStickyState } from "./hooks/stickyState";
import { Action, calculateScore, isGroupAction, isPersonalAction } from "./models/action";
import { Game } from "./models/game";
import defaultGame from "./defaultGame.json";
import { isMultipleChoiceQuestion, isSimpleQuestion } from "./models/questions";
import { NullableRefSelector } from "./create/Common";

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
    <Card>
      <CardContent>
        <Typography variant="h5">{action.name}</Typography>
        <Typography variant="body1">{action.description}</Typography>
        {isPersonalAction(action) && (
          <Typography variant="body2">Role: {game.roles.find(role => role.id == action.roleId)!.name}</Typography>
        )}
        {isGroupAction(action) && (
          <Typography variant="body2">Roles: {action.roleIds.map(roleId => game.roles.find(role => role.id == roleId)!.name).join(", ")}</Typography>
        )}
        <Typography variant="body2">Lieu: {game.map.locations.find(location => location.id == action.locationId)!.name}</Typography>
      </CardContent>
      <CardActionArea onClick={onCompleteAction}>
        Completer
      </CardActionArea>
    </Card>
  )
}

function QuestionOverlay({action, onAnswer}: {action: Action, onAnswer: (correct: boolean) => void}) {
  return (
    <>
      <Stack spacing={2} direction="column">
        <Typography variant="h4">{action.bonusQuestion!.question}</Typography>
        {isMultipleChoiceQuestion(action.bonusQuestion!) && (
          action.bonusQuestion.answers.map(answer => (
            <Button key={answer.answer} onClick={() => onAnswer(answer.isCorrect)}>{answer.answer}</Button>
          ))
        )}
        {isSimpleQuestion(action.bonusQuestion!) && (
          <>
            <Typography variant="h5">Réponse: {action.bonusQuestion!.answer}</Typography>
            <Button onClick={() => onAnswer(true)}>Réponse correcte</Button>
            <Button onClick={() => onAnswer(false)}>Réponse incorrecte</Button>
          </>
        )}
      </Stack>
    </>
  )
}

export function Play() {
  const [score, setScore] = useStickyState<number>(0, "score");
  const [game, setGame] = useState<Game>(defaultGame);
  const [filteredActions, setFilteredActions] = useState<Action[]>(game.actions);
  const [currentAction, setCurrentAction] = useState<Action>();
  const [answerPopup, setAnswerPopup] = useState("");
  return (
    <>
      <GameSourceSelector setGame={setGame} />
      <Button onClick={() => setScore(0)}>Reset</Button>
      <Container maxWidth="md">
        <ScoreCard score={score} />
        <ActionFilters game={game} setFilteredActions={setFilteredActions} />
        <Backdrop
          open={currentAction !== undefined}
          sx={{zIndex: 100, backgroundColor: "rgba(0, 0, 0, 0.8)"}}
        >
          {currentAction?.bonusQuestion && <QuestionOverlay 
            action={currentAction!}
            onAnswer={correct => {
              setScore(score + calculateScore(currentAction!, correct));
              setCurrentAction(undefined);
              setAnswerPopup(correct ? "Correct!" : "Incorrect."); 
            }}
          />}
        </Backdrop>
        <Backdrop
          open={answerPopup !== ""}
          onClick={() => setAnswerPopup("")}
          sx={{zIndex: 100}}
        >
          <Typography variant="h2">{answerPopup}</Typography>
        </Backdrop>
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
      </Container>
    </>
  )
}