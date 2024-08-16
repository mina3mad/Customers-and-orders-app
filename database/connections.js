import mysql2 from 'mysql2'
const dbConnection=()=>{
    const connection=mysql2.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"week5_ass"
    })
    connection.connect((error)=>{
        if(error){
            console.log(error);
        }
        else console.log("database connected");
    })
    return connection;
}
export default dbConnection