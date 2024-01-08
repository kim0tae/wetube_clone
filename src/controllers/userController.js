import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
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
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile", user: req.session.user});
}
export const postEdit = async (req, res) => {
  const { 
    session: { 
      user:  { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const findUsername = await User.findOne({ username });
  const findEmail = await User.findOne({ email });
  if (findUsername._id != _id || findEmail._id != _id) {
    return res.render("editProfile", {
      pageTitle: "Edit  Profile",
      errorMessage: "This username/email is already taken",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(_id, 
    { avatarUrl: file ? file.path : avatarUrl, 
      name, username, email, location },
    { new : true }, 
  );

  req.session.user = updatedUser;

  return res.redirect("/users/edit");
}
// ========================================
export const remove = (req, res) => res.send("Remove Users")
export const getLogin = (req, res) =>  {
  return res.render("login", { pageTitle: "Login" });
}
export const postLogin = async (req, res) =>  {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  const pageTitle = "Login"
  if (!user) {
    return res.status(400).render("login", { 
      pageTitle, 
      errorMessage: "An account with username does not exists." 
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", { 
      pageTitle, 
      errorMessage: "Wrong password." 
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");  
}
// ===============================================
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");

  if (!user) {
    return res.status(404).render("404");
  }

  return res.render("users/profile", { 
    pageTitle : `${user.name}의 Profile`, 
    user,
  });

}
// ===============================================
export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
export const startGithubLogin = (req, res) => { 
  const baseUrl = `https://github.com/login/oauth/authorize`
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emails = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emails.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    } 
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
        socialOnly: true,
      });
    } 
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}
// ========================================
export const getChangePassword = (req, res) => {
  if (req.session.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
  // send notification change password alert
  const  {
    session : { user: { _id, password } },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The current password is incorrect" });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The password does not match the confirmation" });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  user.save();
  req.session.user.password = user.password;
  
  return res.redirect("/users/logout");
}
