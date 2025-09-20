const getImageUrl = (req, filename) => {
    console.log(filename, `${req.protocol}://${req.get('host')}/public/images/${filename}`);
    if (!filename) return null;
    return `${req.protocol}://${req.get('host')}/public/images/${filename}`;
};

module.exports = { getImageUrl };