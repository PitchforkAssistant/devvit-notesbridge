import {ModAction} from "@devvit/protos";
import {TriggerContext} from "@devvit/public-api";
import {getModlogEntry} from "../helpers/modLogHelper.js";
import {onAddNote} from "./onAddNote.js";
import {onWikiRevise} from "./onWikiRevise.js";

export async function onModAction (event: ModAction, context: TriggerContext) {
    // We only care about new native and toolbox notes
    if (event.action !== "addnote" && event.action !== "wikirevise") {
        return;
    }

    if (!event.actionedAt) {
        console.warn("ModAction event is missing actionedAt", event);
        return;
    }

    if (!event.moderator || !event.moderator.id) {
        console.warn("ModAction event is missing moderator.id", event);
        return;
    }

    if (event.moderator.id === context.appAccountId) {
        console.log("Ignoring mod action by self");
        return;
    }

    // We could extract the names for getModlogEntry from the event,
    // but this approach lets us delay looking for the brand new mod action by a tiny bit
    const mod = await context.reddit.getUserById(event.moderator.id);
    const sub = await context.reddit.getCurrentSubreddit();
    const modlogEntry = await getModlogEntry(context.reddit, sub.name, mod.username, event.action, event.actionedAt);
    if (!modlogEntry) {
        throw `Failed to find modlog entry for ${event.action} by ${mod.username} at ${event.actionedAt.toISOString()} in ${sub.name}`;
    }

    console.log("Found modlog entry: ", modlogEntry);

    switch (event.action) {
    case "addnote":
        await onAddNote(context, modlogEntry, sub, mod);
        break;
    case "wikirevise":
        await onWikiRevise(context, modlogEntry, sub, mod);
        break;
    }
}
