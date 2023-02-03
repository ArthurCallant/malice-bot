export function incorrectId(e, msg) {
    msg.reply(
        "I can't seem to find the competition. Are you sure the id is correct?\nUse the '!help' command to get a list of commands and how to use them."
    );
    console.trace();
    console.error(e);
}

export function topTenError(e, msg) {
    msg.reply(
        "Something went wrong getting the top 10 for this metric.\nUse the '!help' command to get a list of commands and how to use them."
    );
    console.trace();
    console.error(e);
}

export function playerError(e, msg) {
    msg.reply(
        "Something went wrong fetching the details for this player. Are you sure the name is correct?\nUse the '!help' command to get a list of commands and how to use them."
    );
    console.trace();
    console.error(e);
}
