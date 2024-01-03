import User from "../models/User";
import bcrypt from "bcrypt";
// ========================================
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
}

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage: "Password confirmation does not match.", 
    });
  }
  const exists = await User.exists({$or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage: "This username/email is already taken" 
    }); 
  }
 
  await User.create({
    name, username, email, password, location
  });
  return res.redirect("/login");
}
// ========================================
export const edit = (req, res) => res.send("Edit Users")
export const remove = (req, res) => res.send("Remove Users")
export const getLogin = (req, res) =>  {
  return res.render("login", { pageTitle: "Login" });
}
export const postLogin = async (req, res) =>  {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });
  const pageTitle = "Login"
  if (!findUser) {
    return res.status(400).render("login", { 
      pageTitle, 
      errorMessage: "An account with username does not exists." 
    });
  }
  const ok = await bcrypt.compare(password, findUser.password);
  if (!ok) {
    return res.status(400).render("login", { 
      pageTitle, 
      errorMessage: "Wrong password." 
    });
  }
  return res.redirect("/");  
}
export const see = (req, res) => res.send("see")
export const logout = (req, res) => res.send("logout")

