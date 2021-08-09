/**
 * Fetch the latest comic from the XKCD API
 *
 * @returns {Promise.<Object>} Returns the latest comic
 */
exports.getLatestComic = async () => {
    const url = new URL("https://xkcd.com/info.0.json");

    const res = await fetch(url.href);

    const json = await res.json();

    return json;
};