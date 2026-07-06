import React, { useEffect, useState } from 'react'
import axios from '../../utils/axiosconfig'

const Users = () => {

    const [users, setUSers] = useState([])

    const fetchUSers = async () => {
        try {

            const res = await axios.get("/users")
            setUSers(res.data)



        } catch (error) {
            console.log(" Error founded :", error);


        }
    }

    useEffect(() => {
        fetchUSers();
    }, []);

    return (
        <div>

            <h1>{users}</h1>

        </div>
    )
}

export default Users
