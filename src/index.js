const { InteractionType, InteractionResponseType, InteractionResponseFlags, verifyKey } = require('discord-interactions');
const commands = require('./build/data/commands.json');

// Util to send a JSON response
const jsonResponse = obj => new Response(JSON.stringify(obj), {
    headers: {
        'Content-Type': 'application/json',
    },
});

// Util to send a perm redirect response
const redirectResponse = url => new Response(null, {
    status: 301,
    headers: {
        Location: url,
    },
});

// Util to verify a Discord interaction is legitimate
const handleInteractionVerification = (request, bodyBuffer) => {
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    return verifyKey(bodyBuffer, signature, timestamp, process.env.CLIENT_PUBLIC_KEY);
};

// Process a Discord command interaction
const handleCommandInteraction = async ({ body, wait }) => {
    // Locate the command data
    const commandData = commands[body.data.id];
    if (!commandData)
        return new Response(null, { status: 404 });

    try {
        // Load in the command
        const command = require(`./commands/${commandData.file}`);

        // Execute
        return await command.execute({ interaction: body, response: jsonResponse, wait });
    } catch (err) {
        // Catch & log any errors
        console.log(body);
        console.error(err);

        // Send an ephemeral message to the user
        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'An unexpected error occurred when executing the command.',
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }
};
// Process a Discord component interaction
const handleComponentInteraction = async ({ body, wait }) => {
    try {
        // Load in the component handler
        const component = require(`./components/${body.data.custom_id}.js`);

        // Execute
        return await component.execute({ interaction: body, response: jsonResponse, wait });
    } catch (err) {
        // Handle a non-existent component
        if (err.code === 'MODULE_NOT_FOUND')
            return new Response(null, { status: 404 });

        // Catch & log any errors
        console.log(body);
        console.error(err);

        // Send a 500
        return new Response(null, { status: 500 });
    }
};

// Process a Discord interaction POST request
const handleInteraction = async ({ request, wait }) => {
    // Get the body as a buffer and as text
    const bodyBuffer = await request.arrayBuffer();
    const bodyText = (new TextDecoder('utf-8')).decode(bodyBuffer);

    // Verify a legitimate request
    if (!handleInteractionVerification(request, bodyBuffer))
        return new Response(null, { status: 401 });

    // Work with JSON body going forward
    const body = JSON.parse(bodyText);

    // Handle different interaction types
    switch (body.type) {
        // Handle a PING
        case InteractionType.PING:
            return jsonResponse({
                type: InteractionResponseType.PONG,
            });

        // Handle a command
        case InteractionType.APPLICATION_COMMAND:
            return handleCommandInteraction({ body, wait });

        // Handle a component
        case InteractionType.MESSAGE_COMPONENT:
            return handleComponentInteraction({ body, wait });

        // Unknown
        default:
            return new Response(null, { status: 501 });
    }
};

// Process all requests to the worker
const handleRequest = async ({ request, wait }) => {
    const url = new URL(request.url);

    // Send interactions off to their own handler
    if (request.method === 'POST' && url.pathname === '/interactions')
        return await handleInteraction({ request, wait });

    // Otherwise, we only care for GET requests
    if (request.method !== 'GET')
        return new Response(null, { status: 404 });

    // Health check route
    if (url.pathname === '/health')
        return new Response('OK', {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Expires: '0',
                'Surrogate-Control': 'no-store',
            },
        });

    // Privacy notice route
    if (url.pathname === '/privacy')
        return new Response(Privacy, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

    // Invite redirect
    if (url.pathname === '/invite')
        return redirectResponse(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=applications.commands`);

    // Docs redirect
    if (url.pathname === '/')
        return redirectResponse('https://waitrose.wtf');

    // Not found
    return new Response(null, { status: 404 });
};

// Register the worker listener
addEventListener('fetch', event => {

    // Process the event
    return event.respondWith(handleRequest({
        request: event.request,
        wait: event.waitUntil.bind(event)
    }).catch(err => {
        // Log & re-throw any errors
        console.error(err);
        throw err;
    }));
});

