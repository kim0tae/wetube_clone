import Video from "../models/Video";

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
   return res.render("watch", { pageTitle: video.title, video});
  }
  return res.render("404", { pageTitle: "Not Found Video" });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  return res.redirect(`/videos/${id}`, video);
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Not Found Video" });
  }
  return res.render("edit", { pageTitle :  `Edit : ${video.title}`, video});
}
export const home = async (req, res) => {
    const videos = await Video.find({});
    if (videos) {
      return res.render("home", { pageTitle: "Home", videos })
    }
}
export const deleteVideo = (req, res) => {
  return res.send("deleteVideo")
}
export const upload = (req, res) => res.send("upload")


export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle : "Upload Video"});
}

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try { 
      await Video.create({
      title: title,
      description : description,
      createdAt: Date.now(),
      hashtags: hashtags.split(',').map(word => `#${word}`),
    })
    return res.redirect("/");
  } catch (error) {
      return res.render("upload", 
      { 
        pageTitle : "Upload Video", 
        errorMessage: error._message 
      })
  }
}