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
    const [key, setKey] = useState("");
    const today = new Date();

    //gelen etkinlik verilerini state e aktar fonk.
    useEffect(() => {

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
        firebaseConfig.database().ref(`durum/${id}`).remove().then(() => console.log("Etkinlik silindi."))
    }

    //gelenleri database e kaydetme fonk
    const addGelen = () => {
            const addRef = db.ref("gelenler");
            addRef.push({
                name: user.displayName,
                where: key,
                status: true,
            });
        setKey("");
    }

    //gelenler silme fonk
    const removeGelen = (id) => {
        firebaseConfig.database().ref(`gelenler/${id}`).remove().then(() => console.log("Gelen silindi."))
        // firebaseConfig.database().ref(`gelenler/${id}/status`).set("false").then(() => console.log("Gelen sa silindi."))
    }

    //gitmek istenilen yerin yazıldığı fonk
    const handleKey = (e) => {
        setKey(e.target.value.toLocaleLowerCase().replace(" ", ""));
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
            <Typography variant="h4" sx={{ color: "blue" }}>Anasayfa</Typography>
            <br />
            <br />
            <Input value={key} onChange={(e) => handleKey(e)} placeholder="Nereye gitmek istediğini yaz.." sx={{ width: "250px" }} />
            <br />
            <Typography align='center' variant='string'>Örn: <mark>kartal</mark>, <mark>maltepe</mark>, <mark>x avm</mark>, <mark>x cafe</mark></Typography>
            <br />
            <Button onClick={addGelen}>Kaydet</Button>
            <br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><u>İsim</u></TableCell>
                            <TableCell><u>Gitmek istediği yer</u></TableCell>
                            <TableCell><u>Tarih / saat</u></TableCell>
                            <TableCell><u>Gelenler</u></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentBlogs?.map((blog, index) => (
                            blog.status !== true ?
                                null :
                                <TableRow
                                    key={blog?.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    sx={{ bgcolor: index % 2 === 0 ? 'Gainsboro' : 'GhostWhite' }}
                                >
                                    <TableCell component="th" scope="row">
                                        {blog?.name}
                                    </TableCell>
                                    <TableCell >{blog?.where || <b>bilgi girilmemiş</b>}</TableCell>
                                    <TableCell sx={{ textDecoration: moment(blog.date, "YYYYMMDD").fromNow().includes("ago") ? "line-through" : "none" }}>{moment(blog?.date).format('LLL') === "Invalid date" ? moment(today).format('LLL') : moment(blog?.date).format('LLL')}</TableCell>
                                    <TableCell sx={{ minWidth: '120px' }}>
                                        {
                                            gelenlerTable ?
                                                gelenlerTable.map((gelen, i) => (
                                                    gelen.where !== blog.where || moment(blog.date, "YYYYMMDD").fromNow().includes("ago") ?
                                                        null
                                                        :
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                            <p
                                                                key={i}
                                                            >
                                                                {gelen?.name}
                                                            </p>
                                                            <Button disabled={user.displayName === gelen.name ? false : true} onClick={() => removeGelen(gelen.id)}><DeleteOutlinedIcon sx={{ color: user.displayName !== gelen.name ? 'grey' : 'red' }} />
                                                            </Button>
                                                        </div>
                                                )) 
                                                : 
                                                null
                                        }
                                    </TableCell>
                                    <Button disabled={user.displayName === blog.name ? false : true} sx={{ color: "red" }} onClick={() => remove(blog.id)}>Sil</Button>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Dashboard
