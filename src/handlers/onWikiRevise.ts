import {ModAction, User, Subreddit, TriggerContext, UserNoteLabel} from "@devvit/public-api";
import {ToolboxClient, Usernote} from "toolbox-devvit";
import {KEYS, T2N_KEY_MAP} from "../constants.js";
import {isNativeLabel} from "./validateNativeLabel.js";

export function isToolboxNotesEdit ({details}: ModAction): boolean {
    return details === "Page usernotes edited";
}

export function getToolboxNoteTarget ({description}: ModAction): string | undefined {
    if (!description) {
        return;
    }

    const noteTargetRegex = description.match(/(?<="create new note on (new )?user ).+?(?=" via toolbox)/);
    if (!noteTargetRegex) {
        return;
    }
    return noteTargetRegex[0];
}

export function getTargetId ({contextPermalink}: Usernote): string | undefined {
    if (!contextPermalink) {
        return;
    }

    const postIdRegex = contextPermalink.match(/(?<=comments\/|redd\.it\/)[a-z0-9]*$/);
    if (postIdRegex) {
        return `t3_${postIdRegex[0]}`;
    }

    const commentIdRegex = contextPermalink.match(/(?<=comments\/([a-z0-9_]+?\/){2})[a-z0-9]*$/);
    if (commentIdRegex) {
        return `t1_${commentIdRegex[0]}`;
    }
}

export async function onWikiRevise ({reddit, settings}: TriggerContext, modAction: ModAction, subreddit?: Subreddit, moderator?: User) {
    if (!subreddit) {
        subreddit = await reddit.getSubredditById(modAction.subredditId);
    }
    if (!moderator) {
        moderator = await reddit.getUserById(modAction.moderatorId);
    }

    if (!isToolboxNotesEdit(modAction)) {
        console.log(`onWikiRevise called for non-notes edit: ${modAction.details}`);
        return;
    }

    const noteTarget = getToolboxNoteTarget(modAction);
    if (!noteTarget) {
        console.log(`onWikiRevise called with non-standard edit message: ${modAction.description}`);
        return;
    }

    const toolbox = new ToolboxClient(reddit);
    const toolboxNotes = await toolbox.getUsernotes(subreddit.name);
    const targetNotes = toolboxNotes.get(noteTarget);
    if (targetNotes.length === 0) {
        console.warn(`onWikiRevise called with no notes found for note target: ${noteTarget}`);
        return;
    }

    // Find the new note
    // We could sort the notes by timestamp and take the newest, doing that could cause issues if Devvit triggers are delayed
    // So we'll find the note with the same creator and closest timestamp to the mod action timestamp
    let createdNote: Usernote | undefined;
    let closestTimestampDifference = Infinity;
    for (const note of targetNotes) {
        if (note.moderatorUsername.toLowerCase() !== moderator.username.toLowerCase()) {
            continue;
        }

        const timestampDifference = Math.abs(note.timestamp.getTime() - modAction.createdAt.getTime());
        if (timestampDifference < closestTimestampDifference) {
            createdNote = note;
            closestTimestampDifference = timestampDifference;
        }
    }

    if (!createdNote) {
        console.warn(`onWikiRevise called with no valid notes found for note target: ${noteTarget}`);
        return;
    }

    const toolboxNoteType = createdNote.noteType ?? "";
    let nativeNoteLabel: UserNoteLabel| UserNoteLabel[] | undefined;
    if (T2N_KEY_MAP[toolboxNoteType]) {
        nativeNoteLabel = await settings.get<string[]>(T2N_KEY_MAP[toolboxNoteType]) as UserNoteLabel[];
    } else {
        // check custom note types ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
        const customNoteTypes = await settings.get<string>(KEYS.T2N_MAP_CUSTOM);
        if (!customNoteTypes) {
            console.warn("onWikiRevise called with no custom note types defined");
            nativeNoteLabel = await settings.get<string[]>(KEYS.T2N_MAP_NONE) as UserNoteLabel[];
        } else {
            const noteTypePairs = customNoteTypes.split("\n");
            for (const pair of noteTypePairs) {
                const splitPair = pair.split(":");
                if (splitPair.length !== 2) {
                    console.warn(`onWikiRevise called with invalid custom note type pair: ${pair}`);
                    continue;
                }
                const [toolboxLabel, nativeLabel] = splitPair;
                if (toolboxLabel === toolboxNoteType) {
                    nativeNoteLabel = nativeLabel as UserNoteLabel;
                    break;
                }
            }
        }
    }

    if (!nativeNoteLabel) {
        console.warn(`onWikiRevise called with no native note label (${nativeNoteLabel}) found for TB note type ${toolboxNoteType}`);
        return;
    }

    if (Array.isArray(nativeNoteLabel)) {
        nativeNoteLabel = nativeNoteLabel[0];
    }

    if (!isNativeLabel(nativeNoteLabel)) {
        console.warn(`onWikiRevise called with invalid native note label (${String(nativeNoteLabel)}) found for TB note type ${toolboxNoteType}`);
        return;
    }

    console.log(`cloning note to native notes with type ${nativeNoteLabel}`);
    const newNote = {
        subreddit: subreddit.name,
        user: noteTarget,
        note: `${createdNote.text} —${moderator.username}`,
        label: nativeNoteLabel,
        redditId: getTargetId(createdNote) ?? "",
    };
    console.log(newNote);
    await reddit.addModNote(newNote);

    // We've found the note, now we can do something with it.
}
