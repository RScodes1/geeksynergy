const jwt = require('jsonwebtoken');
require('dotenv').config()

const auth = (req,res,next)=>{

      const token = req.headers.authorization?.split(" ")[1];
      if(token){
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded){
                req.body.userID = decoded.userID;
                console.log("decoded");
                next();
            }
            else {
                res.send({msg: "not authorized no access", "error": error});
            }
      }
        else {
           res.send({msg: "please login"});
       } 
}

module.exports = {
    auth
}