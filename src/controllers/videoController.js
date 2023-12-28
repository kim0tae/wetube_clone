
export const see = (req, res) => {
  return res.render("watch")
}
export const edit = (req, res) => {
  res.render("edit")
}
export const trending = (req, res) => {
  res.render("home")
}
export const search = (req, res) => res.send("search")
export const deleteVideo = (req, res) => {
  return res.send("deleteVideo")
}
export const upload = (req, res) => res.send("upload")

