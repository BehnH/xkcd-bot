module.exports.createEmbed = (title, description, footer = '') => ({
    title: `XKCD: ${title}`,
    description: description,
    color: 0xf48120,
    timestamp: (new Date).toISOString(),
    footer: footer ? {
        text: footer,
    } : null,
});
