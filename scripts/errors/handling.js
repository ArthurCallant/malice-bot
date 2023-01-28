export function incorrectId(e, msg) {
    msg.reply(
        "I can't seem to find the competition. Are you sure the id is correct?"
    );
    console.trace();
}

export function topTenTtmError(e, msg) {
    msg.reply("Something went wrong getting the top 10 for Time to max.");
    console.trace();
}
