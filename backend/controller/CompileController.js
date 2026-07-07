const axios = require("axios");


const run = async (req, res) => {
    try{
        const {language, code, input} = req.body;
        if(code==undefined){
            res.status(400).json({"message":"Code is required"});
        }
        const output = await axios.post(`${process.env.COMPILER_URI}/run`,
            {
                "language":language,
                "code": code,
                "input": input
            }
        )
        res.status(200).json({"output":output.data});
    }catch(err){
        // console.log(err.message);
        res.status(500).json("message", `Compilation failed ${err.message}`);
    }
}

module.exports={run};