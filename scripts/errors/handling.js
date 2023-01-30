export function incorrectId(e, msg) {
    msg.reply(
        "I can't seem to find the competition. Are you sure the id is correct?"
    );
    console.trace();
}

export function topTenError(e, msg) {
    msg.reply("Something went wrong getting the top 10 for this metric.");
    console.trace();
}

export function playerError(e, msg) {
    msg.reply(
        "Something went wrong fetching the details for this player. Are you sure the name is correct?"
    );
    console.trace();
}
