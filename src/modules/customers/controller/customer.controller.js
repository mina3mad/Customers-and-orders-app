import dbConnection from "../../../../database/connections.js";
import bcryptjs from 'bcryptjs' 
const connection =dbConnection()
// customer signUp
export const signUp=(req,res,next)=>{
    const{email,password}=req.body
    connection.query(`SELECT * FROM customers WHERE email="${email}";`,(error,result)=>{
        if(error){
            return res.status(500).json({message:error})
        }
        if(result.length){
            return res.status(409).json({message:"email already exists"}) 

        }
        const hashPassword=bcryptjs.hashSync(password,8)
        req.body.password=hashPassword
        connection.query(`INSERT INTO customers SET ?`,req.body,(error,result)=>{
            if(error){
                return res.status(500).json({message:error})
            }else{
                return res.status(201).json({message:"signup successfully",result})
            }
        } )
    })

}

//login 
export const login =(req,res,next)=>{
    const{email,password}=req.body
    connection.query(`SELECT * FROM customers WHERE email="${email}";`,(error,result)=>{
        if(error){
            return res.status(500).json({message:error})

        }
        if(result.length){
            console.log(result[0].password);
            const match=bcryptjs.compareSync(password,result[0].password)
            if(match){
                return res.status(200).json({message:"login successfully",userId:result[0].id})

            }
            return res.status(400).json({message:"invalid password!"})


        }else{
        return res.status(400).json({message:"invalid email or password!"})

        }
    })
}
