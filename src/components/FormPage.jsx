import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  }
}));

const FormPage = () => {
  const [goOut, setGoOut] = useState(false);
  const [where, setWhere] = useState('');
  const [date, setDate] = useState('');
  const [isCome, setIsCome] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const handleChangeGoOut=(e)=>{
    setGoOut(e.target.value);
    goOut ? setIsCome("Çıkmıyor, götünü siktirmekle meşgul") : setIsCome("Çıkıyor") 
  }

  const handleChangeWhere = (e) => {
    setWhere(e.target.value);
  }

  const handleChangeDate = (e) => {
    setDate(e.target.value);
  }

  const add = () => {
    const addRef = db.ref("durum");
    addRef.push({
      isim:user.displayName,
      durum:isCome,
      nereye:where,
      tarih:date
    });
    goOut ? setMessage("Durumun paylaşıldı. Göt siktirmeye devam edebilirsin.") :setMessage("Durumun paylaşıldı. Geç kalma sikerim belanı")
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

  useEffect(()=>{
    if(goOut){
      setIsCome("Çıkmıyor, götünü siktirmekle meşgul")
      setWhere('')
      setDate('')
    }else {
      setIsCome("Çıkıyor")
    } 
  }, [goOut])
  
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <br/>
      <Typography variant="h5" sx={{color:"blue"}}>Form Sayfası</Typography>
      <div className={classes.form}>
        <FormControl sx={{ m: 1, maxWidth: 350 }}>
          <Typography>Dışarı Çıkıyor Musun?</Typography>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={goOut}
            onChange={handleChangeGoOut}
            autoWidth
          >
            <MenuItem
              value={false}
            >
              Evet
            </MenuItem>
            <MenuItem
              value={true}
            >
              Hayır
            </MenuItem>
          </Select>
          {
            goOut ? <Typography sx={{ color: "red" }}>Gelmezsen gelme yarrağım</Typography> : null
          }
          <br /><br />
          <Typography>Nereye Gidelim?</Typography>
          <TextField
            disabled={goOut}
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
            disabled={goOut}
            onChange={handleChangeDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br /><br />
          <Button onClick={add} sx={{ color: "blue", outline: "solid" }}>Hırtlarla Paylaş</Button>
          <br/>
          <Typography sx={{ color: "red" }}>{message}</Typography>
        </FormControl>
      </div>
    </div>
  );
};

export default FormPage;