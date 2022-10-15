module.exports = {
  post: async (req, res) => {
    try {
      return res.json({
        success: true,
        image: res.req.file.location,
        fileName: res.req.file.filename,
      });  
    } catch (err) {
      console.log(err);
    }   
  }
}