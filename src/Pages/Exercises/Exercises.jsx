import React from 'react';
import Menu from '../../Components/Menu/Menu';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { allExercises } from "../../assets/exercises/all-exercises";


function Exercises({ menu }) {

  return (
    <div>
      {menu}
      <Container fixed sx={{ mt: 4 }}>
        <Grid container spacing={2} direction="row">
          {allExercises.map((ex) => (
            <Grid item xs={12} sm={6} md={4} key={ex.id}>
              <Card sx={{ maxWidth: 345, mt: 2 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={ex.gifUrl}
                  title={ex.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {ex.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Objetivo: {ex.bodyPart}/{ex.target}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equipo: {ex.equipment}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" sx={{ width: "100%" }}>Editar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Exercises;