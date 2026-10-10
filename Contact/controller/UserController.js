
const Login = require("../Models/UserModel");


exports.SignIn = async (req,res) =>{

    try{
        const {Username,Email,Password,ConfirmPassword} = req.body
        if(!Username || !Email || !Password){
            return res.status(400).json({
            message: "All fields are required"
        });
        }
        const user = await Login.findOne({$or: [{ Username }, { Email }]});

        if (user) {
            return res.status(400).json({
                message: "User already registered"
            });
        }

        if(Password !== ConfirmPassword){
            return res.status(400).json({
            message: "Password and Confirm Password must be same"
        });
        }



    const Payload = {Username,Email,Password,ConfirmPassword}
    const SignIn = await Login.create(Payload)

    return res.status(201).json({
        message: "Account Created successfully",
        login: SignIn
    });

    }
    catch(error){
        return res.status(500).json({
            message: "Error creating account",
            error: error.message
        });
    }
}




exports.Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        message: "Username and Password are required",
      });
    }

    const user = await Login.findOne({ Email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.Password !== Password) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({message: "Login successful",});
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};
