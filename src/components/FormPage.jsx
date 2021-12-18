import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { TextField } from "@material-ui/core";
import { auth, db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  div: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    width: "100%"
  },
  form: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    width: "100%", 
    marginTop: theme.spacing(3),
  }
}));

const FormPage = () => {
  const [where, setWhere] = useState(''); 
  const [date, setDate] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  // const [status, setStatus] = useState(true);

  const handleChangeWhere = (e) => {
    setWhere(e.target.value.toLocaleLowerCase());
  }

  const handleChangeDate = (e) => {
    setDate(e.target.value);
  }
  
  const add = () => {
    const addRef = db.ref("durum");
    addRef.push({
      name:user.displayName,
      where:where,
      date:date,
      status:true
    });
    setMessage("Durumun paylaşıldı.")
  }

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
  }, [])
  console.log(user)
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <br/>
      <Typography variant="h5" sx={{color:"blue"}}>Etkinlik Paylaş</Typography>
      <div className={classes.form}>
        <FormControl sx={{ m: 1, maxWidth: 350 }}>
          <br /><br />
          <Typography>Nereye Gitmek İstiyorsun?</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Örn:Piazza MOC, Pendik marina.."
            onChange={handleChangeWhere}
            value={where}
          />
          <br /><br />
          <Typography>Tarih ve Saat gir</Typography>
          <TextField
            id="datetime-local"
            type="datetime-local"
            sx={{ width: 250 }}
            variant="outlined"
            value={date}
            onChange={handleChangeDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br /><br />
          <Button onClick={add} sx={{ color: "blue", outline: "solid" }}>Arkadaşlarınla Paylaş</Button>
          <br/>
          <Typography sx={{ color: "red" }}>{message}</Typography>
        </FormControl>
      </div>
    </div>
  );
};

export default FormPage;