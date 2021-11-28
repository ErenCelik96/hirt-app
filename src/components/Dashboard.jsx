import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { db } from '../firebase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const Dashboard = () => {
    const [currentBlogs, setCurrentBlogs] = useState();
    const today = new Date();

    function getOneBlog(id) {
        const result = currentBlogs?.filter((item) => item.id === id);
        return result;
    }

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

    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
            <br/>
            <Typography variant="h5" sx={{color:"blue"}}>Anasayfa</Typography>
            <br/>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><u>İsim</u></TableCell>
                            <TableCell><u>Dışarı çıkma durumu</u></TableCell>
                            <TableCell><u>Gitmek istediği yer</u></TableCell>
                            <TableCell><u>Tarih / saat</u></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentBlogs?.map((blog) => (
                            <TableRow
                                key={blog.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {blog.isim}
                                </TableCell>
                                <TableCell >{blog.durum || <b>bilgi girmemiş sığır</b>}</TableCell>
                                <TableCell >{blog.nereye || <b>bilgi girmemiş sığır</b>}</TableCell>
                                <TableCell >{moment(blog.tarih).format('LLL') === "Invalid date" ? moment(today).format('LLL') : moment(blog.tarih).format('LLL')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Dashboard
