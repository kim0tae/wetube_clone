import User from "../models/User";

// ========================================
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
}

export const postJoin = async (req, res) => {
  const { name, username, email, password, location } = req.body;
  const user = await User.create({
    name, username, email, password, location
  });
  return res.redirect("/login");
}
// ========================================
export const edit = (req, res) => res.send("Edit Users")
export const remove = (req, res) => res.send("Remove Users")
export const login = (req, res) => res.send("login")
export const see = (req, res) => res.send("see")
export const logout = (req, res) => res.send("logout")

