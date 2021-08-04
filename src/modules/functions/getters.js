const { default: fetch } = require("node-fetch")

exports.getLatestComic = async () => {
    return new Promise((resolve, reject) => {
        const URL = `https://xkcd.com/info.0.json`;

        fetch(URL)
            .then(r => r.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
}