import React, { useState, useEffect } from 'react'
import moment from 'moment'
import firebaseConfig, { db } from '../firebase';
import Table from '@mui/material/Table';
import { Chip } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Paper from '@mui/material/Paper';
import { Button, Input, Typography } from '@mui/material';
import "firebase/database";

const Dashboard = ({ user }) => {
    const [currentBlogs, setCurrentBlogs] = useState();
    const [gelenlerTable, setGelenlerTable] = useState();
    const [come, setCome] = useState();
    const [key, setKey] = useState("");
    const today = new Date();

    //gelen etkinlik verilerini state e aktar fonk.
    useEffect(() => {
        setCome(true);
        const addRef = db.ref("durum");
        addRef.on("value", (snapshot) => {
            const durum = snapshot.val();
            const blogL = [];
            for (let id in durum) {
                blogL.push({ id, ...durum[id] });
            }
            setCurrentBlogs(blogL);
        });
    }, []);

    //gelenler bilgilerini state e aktarma fonk
    useEffect(() => {

        const addRef = db.ref("gelenler");
        addRef.on("value", (snapshot) => {
            const durum = snapshot.val();
            const blogL = [];
            for (let id in durum) {
                blogL.push({ id, ...durum[id] });
            }
            setGelenlerTable(blogL);
        });
    }, []);


    //etkinlik veri silme fonk.
    const remove = (id) => {
        firebaseConfig.database().ref(`durum/${id}`).remove().then(() => console.log("Durum silindi."))
    }

    //gelenleri database e kaydetme fonk
    const addGelen = () => {
        if (come) {
            const addRef = db.ref("gelenler");
            addRef.push({
                isim: user.displayName,
                where: key
            });
        };
        setCome(false);
        setKey("");
    }

    //gelenler silme fonk
    const removeGelen = (id) => {
        firebaseConfig.database().ref(`gelenler/${id}`).remove().then(() => console.log("Durum silindi."))
        setCome(true);
    }

    //gitmek istenilen yerin yazıldığı fonk
    const handleKey = (e) => {
        setKey(e.target.value.toLocaleLowerCase());
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
            <Typography variant="h4" sx={{ color: "blue" }}>Anasayfa</Typography>
            <br />
            <br />
            <Input value={key} onChange={(e) => handleKey(e)} placeholder="Nereye gitmek istediğini yaz.." sx={{ width: "250px" }} />
            <br />
            <Typography align='center' variant='string'>Gitmek istediğiniz yeri <u>doğru</u> ve <u>eksiksiz</u>  girin. <br /> Örn: <mark>kartal</mark>, <mark>piazza</mark>, <mark>pendik marina</mark></Typography>
            <br />
            <Button onClick={addGelen}>Kaydet</Button>
            <br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><u>Sıra</u></TableCell>
                            <TableCell><u>İsim</u></TableCell>
                            <TableCell><u>Gitmek istediği yer</u></TableCell>
                            <TableCell><u>Tarih / saat</u></TableCell>
                            <TableCell><u>Gelenler</u></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentBlogs?.map((blog, index) => (

                            <TableRow
                                key={blog?.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell ><b>{index + 1}</b></TableCell>
                                <TableCell component="th" scope="row">
                                    {blog?.isim}
                                </TableCell>
                                <TableCell >{blog?.nereye || <b>bilgi girilmemiş</b>}</TableCell>
                                <TableCell sx={{ textDecoration: moment(blog.tarih, "YYYYMMDD").fromNow().includes("ago") ? "line-through" : "none" }}>{moment(blog?.tarih).format('LLL') === "Invalid date" ? moment(today).format('LLL') : moment(blog?.tarih).format('LLL')}</TableCell>
                                <TableCell sx={{minWidth:'120px'}}>
                                    {
                                        gelenlerTable.map((gelen, i) => (
                                            gelen.where !== blog.nereye || gelen.where === "" || moment(blog.tarih, "YYYYMMDD").fromNow().includes("ago") || user.displayName === blog.isim ?
                                                null
                                                :
                                                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                    <p
                                                        key={i}
                                                    >
                                                        {gelen?.isim}
                                                    </p>
                                                    <Button disabled={user.displayName === gelen.isim ? false : true} onClick={() => removeGelen(gelen.id)}><DeleteOutlinedIcon sx={{ color: user.displayName !== gelen.isim ? 'grey' : 'red' }} />
                                                    </Button>
                                                </div>

                                        ))
                                    }
                                </TableCell>
                                <Button disabled={user.displayName === blog.isim ? false : true} sx={{ color: "red" }} onClick={() => remove(blog.id)}>Sil</Button>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Dashboard
