
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images",express.static("uploads"));

// Routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use((request, response, next)=>{
    if(request.url.includes("login"))
    {
        next();
    }
    else
    {
        var authHeaderDetails = request.headers.authorization ;
       
        if(authHeaderDetails!=null && authHeaderDetails!=undefined)
        {
            var key = config.get("jwtKey");

            var payLoadData  = jwt.verify(authHeaderDetails,key)
          
            var isTokenCorrect = payLoadData.isUserValid;
            //Check token validity here .. may be against DB or so..

            if(isTokenCorrect)
            {
                next()
            }
            else
            {
                response.write("Token Incorrect!");
                response.end();
            }
        }
        else
        {
                response.write("Token required. Pls Login!");
                response.end();
        }
    }
})


app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Start the server
app.listen(4444, () => {
  console.log(`Server started on port: 4444`);
});